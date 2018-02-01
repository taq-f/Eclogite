import { git } from './core';

import { Branch } from '../../models/branch';
import { Repository } from '../../models/repository';

/**
 * Push branch.
 * TODO: specify branch.
 */
export async function push(
  repository: Repository,
  branch: Branch
): Promise<Branch> {
  const result = await git(
    [
      'push',
    ],
    repository.path,
  );

  if (result.exitCode !== 0) {
    return Promise.reject(result.stderr);
  }

  return branch;
}
