/**
 * Selected state of lines in a hunk.
 *
 * * all: all changed lines are selected.
 * * partial: some of changed lines are selected.
 * * none: none of changed lines are selected.
 */
export type SelectedState = 'all' | 'partial' | 'none';

/**
 * The line types in a hunk.
 */
export type HunkLineType = 'unchanged' | 'plus' | 'minus';

interface IFileDiff {
  path: string;
  diffInfo: ReadonlyArray<string>;
  hunks: ReadonlyArray<Hunk>;
}

interface IHunk {
  header: HunkHeader;
  lines: ReadonlyArray<HunkLine>;
  /**
   * Selected state of this hunk.
   */
  selectedState: SelectedState;
  noNewlineWarning?: boolean;
}

export class FileDiff implements IFileDiff {
  path: string;
  diffInfo: ReadonlyArray<string>;
  hunks: ReadonlyArray<Hunk>;

  constructor(fileDiff: IFileDiff) {
    this.path = fileDiff.path;
    this.diffInfo = fileDiff.diffInfo;
    this.hunks = fileDiff.hunks;
  }

  /**
   * Construct patch string.
   *
   * When hunks are specified, generate only of the hunks.
   */
  getPatch(hunk?: Hunk): string {
    const patch = this.hunks
      .filter(h => hunk ? h === hunk : true)
      .filter(h => h.selectedState !== 'none')
      .map(h => h.format())
      .join('\n');

    return [...this.diffInfo, patch].join('\n') + '\n';
  }
}

/**
 * A hunk header, which represents changed location in a file.
 *
 * Below is an example.
 * @@ -50,10 +50,10 @@ def remote_addr():
 */
export interface HunkHeader {
  /**
   * A whole line of header content
   */
  content: string;
  /**
   * A line number that this hunk represents before edit.
   */
  oldFileStartLineNo: number;
  /**
   * A line number that this hunk represents after edit.
   */
  newFileStartLineNo: number;
}

/**
 * Represents a line in a hunk.
 */
export interface HunkLine {
  type: HunkLineType;
  oldLineNo: number;
  newLineNo: number;
  content: string;
  selected?: boolean;
  isNoNewLineWarning?: boolean;
}

/**
 *
 */
export class Hunk implements IHunk {
  header: HunkHeader;
  lines: ReadonlyArray<HunkLine>;
  selectedState: SelectedState;
  noNewlineWarning: boolean;

  constructor(hunkBase: IHunk) {
    this.header = hunkBase.header;
    this.lines = hunkBase.lines;
    this.selectedState = hunkBase.selectedState;
  }

  /**
   * Returns a patch string of this hunk.
   */
  format(): string {
    const header = this.header;

    if (this.selectedState === 'none') {
      // when no lines are selected, there is no patch available.
      throw new Error('No patch is available since no line is selected.');
    }

    let oldLineCount = 0;
    let newLineCount = 0;

    const lineBuffer: string[] = [];

    for (const line of this.lines) {
      if (line.type === 'unchanged') {
        // just add count and add the line to buffer.
        if (!line.isNoNewLineWarning) {
          oldLineCount++;
          newLineCount++;
        }
        lineBuffer.push(line.content);
      } else if (line.type === 'minus') {
        if (line.selected) {
          oldLineCount++;
          lineBuffer.push(line.content);
        } else {
          // If the deleted line is unselected, edit the line as if it was not deleted.
          oldLineCount++;
          newLineCount++;
          const l = ' ' + line.content.slice(1);
          lineBuffer.push(l);
        }
      } else if (line.type === 'plus') {
        if (line.selected) {
          newLineCount++;
          lineBuffer.push(line.content);
        } else {
          // If the added line is unselected, pretend there is no additional line
          // (do not add the line to buffer). And do not count up the new count.
        }
      }
    }

    const headerText = `@@ -${header.oldFileStartLineNo},${oldLineCount} +${header.newFileStartLineNo},${newLineCount} @@`;

    return [headerText, ...lineBuffer].join('\n');
  }
}

export function setHunkState(hunk: Hunk): void {
  let allTrue = true;
  let allFalse = true;
  const lines = hunk.lines;

  lines.forEach(l => {
    if (l.type === 'unchanged') {
      return;
    }
    if (l.selected) {
      allFalse = false;
    } else {
      allTrue = false;
    }
  });

  if (allTrue) {
    hunk.selectedState = 'all';
  } else if (allFalse) {
    hunk.selectedState = 'none';
  } else {
    hunk.selectedState = 'partial';
  }
}
