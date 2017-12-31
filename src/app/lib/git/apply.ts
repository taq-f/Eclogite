import { git, IGitResult } from './core';

import { writeFileSync } from 'fs';

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
    {stdin: patch}
  );

  if (result.exitCode !== 0) {
    // TODO
    console.log('err', result.stderr);
    return;
  }

  return undefined;
}
