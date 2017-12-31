import { GitProcess, GitError, IGitExecutionOptions, IGitResult } from 'dugite';

export type IGitResult = IGitResult;

export async function git(
  args: string[],
  path: string,
  options?: IGitExecutionOptions
): Promise<IGitResult> {
  return await GitProcess.exec(args, path, options);
}
