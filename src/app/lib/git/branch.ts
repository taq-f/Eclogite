import { git, IGitResult } from './core';

import { Branch, BranchType } from '../../models/branch';
import { Repository } from '../../models/repository';

/**
 * Get current branch.
 * This does not use "branch" command, but "rev-parse" to find out the
 * current branch.
 */
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

  return { name: result.stdout.trim(), current: true };
}

/**
 * Get all branches.
 */
export async function getBranches(
  repository: Repository
): Promise<ReadonlyArray<Branch>> {
  const currentBranch = await getCurrentBranch(repository);

  const delimiter = '1F';
  const delimiterString = String.fromCharCode(parseInt(delimiter, 16));

  const format = [
    '%(refname)',
    '%(refname:short)',
    '%(upstream:short)',
    '%(objectname)', // SHA
    '%(author)',
    '%(parent)', // parent SHAs
    '%(symref)',
    '%(subject)',
    '%(body)',
    `%${delimiter}`, // indicate end-of-line as %(body) may contain newlines
  ].join('%00');

  const result = await git(
    [
      'for-each-ref',
      `--format=${format}`,
      'refs/heads',
      'refs/remotes',
    ],
    repository.path,
  );

  if (result.exitCode !== 0) {
    return Promise.reject(result.stderr);
  }

  const branches: Branch[] = [];
  const lines = result.stdout.split(delimiterString).slice(0, -1);

  lines.forEach((line, i) => {
    const pieces = (i > 0 ? line.substr(1) : line).split('\0');

    const ref = pieces[0];
    const name = pieces[1];
    const upstream = pieces[2];
    const sha = pieces[3];

    const type: BranchType = ref.startsWith('refs/head')
      ? 'local' : 'remote';

    branches.push({
      name,
      current: currentBranch.name === name, // TODO
      upstream,
      type,
    });
  });

  return branches;
}

/**
 * Checkout a branch.
 *
 * @returns A branch checked out.
 */
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

/**
 * Create a branch. Always create a branch based on the current branch.
 *
 * @returns Newly create branch.
 */
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

/**
 * Delete a branch.
 *
 * @returns Deleted branch.
 */
export async function deleteBranch(
  repository: Repository,
  branch: Branch
): Promise<Branch> {
  console.log([
    'branch',
    '-d',
    branch.name,
  ]);
  const result = await git([
    'branch',
    '-d',
    branch.name,
  ], repository.path);

  if (result.exitCode !== 0) {
    return Promise.reject(result.stderr);
  }

  return branch;
}
