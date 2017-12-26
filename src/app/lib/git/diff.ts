import { git } from './core';
import { Hunk, Line } from '../../models/diff';

export async function getDiff(
  repositoryPath: string,
  filepath: string
) {
  const args = [
    'diff',
    'HEAD',
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
  const diffLines = components[3].split('\n').slice(4);

  const diffHeaderRe = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/;

  const hunks: Hunk[] = [];
  let lines: Line[];
  let startBeforeLineNo: number;
  let startAfterLineNo: number;

  for (const l of diffLines) {
    // Header?
    const m = diffHeaderRe.exec(l);
    if (m) {
      if (lines) {
        hunks.push({ lines });
      }
      lines = [{
        type: 'header',
        lineNoBefore: -1,
        lineNoAfter: -1,
        content: l,
      }];

      startBeforeLineNo = Number(m[1]);
      startAfterLineNo = Number(m[3]);
      continue;
    }

    if (l.startsWith('+')) {
      lines.push({
        type: 'plus',
        lineNoBefore: -1,
        lineNoAfter: startAfterLineNo,
        content: l,
      });
      startAfterLineNo++;
    } else if (l.startsWith('-')) {
      lines.push({
        type: 'minus',
        lineNoBefore: startBeforeLineNo,
        lineNoAfter: -1,
        content: l,
      });
      startBeforeLineNo++;
    } else {
      lines.push({
        type: 'unchanged',
        lineNoBefore: startBeforeLineNo,
        lineNoAfter: startAfterLineNo,
        content: l,
      });
      startAfterLineNo++;
      startBeforeLineNo++;
    }
  }
  hunks.push({ lines });

  console.log(JSON.stringify(hunks, null, 2));
}
