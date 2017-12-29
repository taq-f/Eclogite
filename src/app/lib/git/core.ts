import { GitProcess, GitError, IGitResult } from 'dugite';

export type IGitResult = IGitResult;

export async function git(args: string[], path: string): Promise<IGitResult> {
  return await GitProcess.exec(args, path);
}
