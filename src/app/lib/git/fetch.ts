import { git } from './core';

import { Branch } from '../../models/branch';
import { Repository } from '../../models/repository';

/**
 * Fetch.
 * TODO: specify branch.
 */
export async function fetch(
  repository: Repository,
  branch: Branch
): Promise<Branch> {
  const result = await git(
    [
      'fetch',
    ],
    repository.path,
  );

  if (result.exitCode !== 0) {
    return Promise.reject(result.stderr);
  }

  return branch;
}
