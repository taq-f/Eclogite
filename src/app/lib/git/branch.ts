import { git, IGitResult } from './core';

export async function branch(
  repositoryPath: string
): Promise<string[]> {
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

  return result.stdout.split('\n');
}
