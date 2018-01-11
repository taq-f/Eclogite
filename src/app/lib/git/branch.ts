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
    .map(v => {
      if (v.startsWith('*')) {
        return {
          name: v.substring(2).trim(),
          current: true,
        };
      } else {
        return {
          name: v.trim(),
          current: false,
        };
      }
    });
}

export async function checkout(
  repositoryPath: string,
  toBranch: string,
): Promise<undefined> {
  const result = await git(
    [
      'checkout',
      '-q',
      toBranch,
    ],
    repositoryPath,
  );

  if (result.exitCode !== 0) {
    // TODO
    console.log('err', result.stderr);
    return;
  }

  return;
}
