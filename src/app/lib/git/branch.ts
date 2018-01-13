import { git, IGitResult } from './core';

import { Branch } from '../../models/branch';

export async function getBranches(
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
  toBranch: Branch,
): Promise<Branch> {
  const result = await git(
    [
      'checkout',
      '-q',
      toBranch.name,
    ],
    repositoryPath,
  );

  if (result.exitCode !== 0) {
    return Promise.reject(result.stderr);
  }

  return toBranch;
}

export async function createBranch(
  repositoryPath: string,
  branchName: string
): Promise<Branch> {
  const result = await git(
    [
      'checkout',
      '-b',
      branchName,
    ],
    repositoryPath,
  );

  if (result.exitCode !== 0) {
    return Promise.reject(result.stderr);
  }

  return { name: branchName, current: true };
}
