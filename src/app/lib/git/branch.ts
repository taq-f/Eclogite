import { git, IGitResult } from './core';

import { Branch } from '../../models/branch';
import { Repository } from '../../models/repository';

export async function getCurrentBranch(
  repository: Repository
): Promise<Branch> {
  const result = await git(
    [
      'rev-parse',
      '--abbrev-ref',
      'HEAD',
    ],
    repository.path,
  );

  if (result.exitCode !== 0) {
    return Promise.reject(result.stderr);
  }

  return { name: result.stdout, current: true };
}

export async function getBranches(
  repository: Repository
): Promise<ReadonlyArray<Branch>> {
  const result = await git(
    [
      'branch',
      '--no-color',
    ],
    repository.path,
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
  repository: Repository,
  toBranch: Branch,
): Promise<Branch> {
  const result = await git(
    [
      'checkout',
      '-q',
      toBranch.name,
    ],
    repository.path,
  );

  if (result.exitCode !== 0) {
    return Promise.reject(result.stderr);
  }

  return toBranch;
}

export async function createBranch(
  repository: Repository,
  branchName: string
): Promise<Branch> {
  const result = await git(
    [
      'checkout',
      '-b',
      branchName,
    ],
    repository.path,
  );

  if (result.exitCode !== 0) {
    return Promise.reject(result.stderr);
  }

  return { name: branchName, current: true };
}
