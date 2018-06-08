import { git, IGitResult } from './core';
import { Repository } from '../../models/repository';
import { AppWorkingFileChange } from '../../models/workingfile';

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

export async function stage(
  repositoryPath: string,
  filepath: string
): Promise<undefined> {
  const result = await git(
    [
      'add',
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

export async function discardChange(
  repository: Repository,
  file: AppWorkingFileChange
): Promise<undefined> {
  // Changes in modified and delete files can be discarded by checkout.
  const result = await git(
    [
      'checkout',
      '--',
      file.path,
    ],
    repository.path,
  );

  if (result.exitCode !== 0) {
    // TODOa
    console.log('err', result.stderr);
    return;
  }

  return undefined;
}
