import { git, IGitResult } from './core';

import { Branch } from '../../models/branch';

export async function branch(
  repositoryPath: string
): Promise<ReadonlyArray<Branch>> {
  const result = await git(
    [
      'branch',
      '--no-color',
    ],
    repositoryPath,
  );

  if (result.exitCode !== 0) {
    // TODO
    console.log('err', result.stderr);
    return;
  }

  return result.stdout
    .split('\n')
    .filter(v => v)
    .map(l => ({ name: l }));
}
