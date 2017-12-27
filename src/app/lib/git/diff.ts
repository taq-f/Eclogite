import { git } from './core';
import { FileDiff, Hunk, HunkLine } from '../../models/diff';

export async function getDiff(
  repositoryPath: string,
  filepath: string
): Promise<FileDiff> {
  const args = [
    'diff',
    // 'HEAD',
    '--no-ext-diff',
    '--patch-with-raw',
    '-z',
    '--no-color',
    '--',
    filepath,
  ];

  const result = await git(args, repositoryPath);

  if (result.exitCode !== 0) {
    // TODO
    console.log('err', result.stderr);
    return;
  }

  const output = result.stdout;
  const components = output.split('\0');
  const diffInfo = components[3].split('\n').slice(2, 4);
  const diffLines = components[3].split('\n').slice(4, -1);

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
        oldLineNo: oldFileStartLineNo,
        newLineNo: newFileStartLineNo,
        content: line,
      });
      oldFileStartLineNo++;
      newFileStartLineNo++;
    }
  }

  return new FileDiff({
    path: filepath,
    diffInfo,
    hunks,
  });
}
