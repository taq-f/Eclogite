import { git, IGitResult } from './core';
import { FileDiff, Hunk, HunkLine } from '../../models/diff';
import { AppStatusEntry } from '../../models/workingfile';

export async function getDiff(
  repositoryPath: string,
  filepath: string,
  status: AppStatusEntry
): Promise<FileDiff> {
  console.log(status);

  let result: IGitResult;
  let successExitCode: Set<number> | undefined;

  if (status === AppStatusEntry.Added) {
    // git diff --no-ext-diff --no-index  --patch-with-raw -z -- /dev/null some.txt
    const args = [
      'diff',
      // 'HEAD',
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
      // 'HEAD',
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
