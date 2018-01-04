import { git, IGitResult } from './core';

export async function commit(
  repositoryPath: string,
  message: string
): Promise<undefined> {
  const result = await git(
    [
      'commit',
      '-F',
      '-',
    ],
    repositoryPath,
    { stdin: message }
  );

  if (result.exitCode !== 0) {
    // TODO
    console.log('err', result.stderr);
    return;
  }

  return undefined;
}
