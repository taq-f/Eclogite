import { git, IGitResult } from './core';
import { FileDiff, Hunk, HunkLine } from '../../models/diff';
import { AppStatusEntry, AppWorkingFileChange } from '../../models/workingfile';

const noNewlineWarning = 'No newline at end of file';
const imageFileExtensions = new Set(['.png', '.jpg', '.jpeg', '.gif', '.ico']);

export async function getDiff(
  repositoryPath: string,
  fileChange: AppWorkingFileChange
): Promise<FileDiff> {
  const filepath = fileChange.path;
  const status = fileChange.state;
  let result: IGitResult;
  let successExitCode: Set<number> | undefined;

  const extraArgs = fileChange.indexState === 'staged' ? ['--cached'] : [];

  if (status === AppStatusEntry.Added) {
    const args = [
      'diff',
      '--no-ext-diff',
      '--no-index',
      '--patch-with-raw',
      '-z',
      '--no-color',
      '--',
      '/dev/null',
      filepath,
    ];
    successExitCode = new Set([0, 1]);
    result = await git(args, repositoryPath);
  } else if (status === AppStatusEntry.Modified) {
    const args = [
      'diff',
      ...extraArgs,
      '--no-ext-diff',
      '--patch-with-raw',
      '-z',
      '--no-color',
      '--',
      filepath,
    ];
    result = await git(args, repositoryPath);
    successExitCode = new Set([0]);
  } else if (status === AppStatusEntry.Deleted) {
    const args = [
      'diff',
      ...extraArgs,
      '--no-ext-diff',
      '--patch-with-raw',
      '-z',
      '--no-color',
      '--',
      filepath,
    ];
    result = await git(args, repositoryPath);
    successExitCode = new Set([0]);
  }

  if (!successExitCode.has(result.exitCode)) {
    // TODO
    console.log('err', result.exitCode, result.stderr);
    return;
  }

  const output = result.stdout;
  const components = output.split('\0');
  let diffInfo: string[];
  let diffLines: string[];

  if (status === AppStatusEntry.Added) {
    diffInfo = components[3].split('\n').slice(3, 5);
    diffLines = components[3].split('\n').slice(5, -1);
  } else if (status === AppStatusEntry.Modified) {
    diffInfo = components[3].split('\n').slice(2, 4);
    diffLines = components[3].split('\n').slice(4, -1);
  } else if (status === AppStatusEntry.Deleted) {
    diffInfo = components[3].split('\n').slice(3, 5);
    diffLines = components[3].split('\n').slice(5, -1);
  } else {
    throw new Error(`unknown status: ${status}`);
  }

  const diffHeaderRe = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/;

  let oldFileStartLineNo: number;
  let newFileStartLineNo: number;
  let hunk: Hunk;
  const hunks: Hunk[] = [];
  let hunkLines: HunkLine[];

  for (const line of diffLines) {
    const m = diffHeaderRe.exec(line);
    if (m) {
      // Header! which means start makign a hunk.
      oldFileStartLineNo = Number(m[1]);
      newFileStartLineNo = Number(m[3]);
      hunkLines = [];

      hunk = new Hunk({
        header: {
          content: line,
          oldFileStartLineNo: oldFileStartLineNo,
          newFileStartLineNo: newFileStartLineNo,
        },
        lines: hunkLines,
        selectedState: 'all',
      });

      hunks.push(hunk);
      continue;
    }

    // This is a warning that the file does not have a newline at the end of
    // the file. So should not be rendered as a "line."
    // TODO: better way to judge.
    // continue;
    const isNoNewlineWarning = line.indexOf(noNewlineWarning) > -1;

    if (line.startsWith('+')) {
      hunkLines.push({
        type: 'plus',
        oldLineNo: -1,
        newLineNo: newFileStartLineNo,
        content: line,
        selected: true,
      });
      newFileStartLineNo++;
    } else if (line.startsWith('-')) {
      hunkLines.push({
        type: 'minus',
        oldLineNo: oldFileStartLineNo,
        newLineNo: -1,
        content: line,
        selected: true,
      });
      oldFileStartLineNo++;
    } else {
      hunkLines.push({
        type: 'unchanged',
        oldLineNo: isNoNewlineWarning ? -1 : oldFileStartLineNo,
        newLineNo: isNoNewlineWarning ? -1 : newFileStartLineNo,
        content: line,
        isNoNewLineWarning: isNoNewlineWarning,
      });
      oldFileStartLineNo++;
      newFileStartLineNo++;
    }
  }

  return new FileDiff({
    path: filepath,
    diffInfo,
    hunks,
    isBinary: isBinary(diffInfo),
  });
}

/**
 * Inspect if the file is a binary file or not.
 */
function isBinary(lines: ReadonlyArray<string>): boolean {
  for (const l of lines) {
    if (l.startsWith('Binary files') && l.endsWith('differ')) {
      return true;
    }
  }
  return false;
}
