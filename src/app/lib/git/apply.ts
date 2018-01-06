import { git, IGitResult } from './core';

export async function applyPatch(
  repositoryPath: string,
  patch: string
): Promise<undefined> {
  const result = await git(
    [
      'apply',
      '--cached',
      '--unidiff-zero',
      '--whitespace=nowarn',
      '-',
    ],
    repositoryPath,
    { stdin: patch }
  );

  if (result.exitCode !== 0) {
    // TODO
    console.log('err', result.stderr);
    return;
  }

  return undefined;
}

export async function unstage(
  repositoryPath: string,
  filepath: string
): Promise<undefined> {
  const result = await git(
    [
      'reset',
      'HEAD',
      filepath,
    ],
    repositoryPath,
  );

  if (result.exitCode !== 0) {
    // TODO
    console.log('err', result.stderr);
    return;
  }

  return undefined;
}
