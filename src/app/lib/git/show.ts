import { ChildProcess } from 'child_process';
import { readFile } from 'fs';
import { join } from 'path';
import { git } from './core';
import { Repository } from '../../models/repository';

/**
 * Get buffer of a binary contents on a specific commit.
 */
export async function getBinaryContents(
  repository: Repository,
  commitSHA: string,
  path: string
): Promise<Buffer> {
  const successExitCodes = new Set([0, 1]);
  const setBinaryEncoding: (process: ChildProcess) => void = cb =>
    cb.stdout.setEncoding('binary');

  const contents = await git(
    ['show', `${commitSHA}:${path}`],
    repository.path,
    {
      processCallback: setBinaryEncoding,
    }
  );

  return Buffer.from(contents.stdout, 'binary');
}

/**
 * Get buffer of a binary contents of working file.
 * Aothough this does not issue any git command, add in this library to be used
 * like getBinaryContents.
 */
export async function getWorkingFileBinaryContents(
  repository: Repository,
  path: string
): Promise<Buffer> {
  const p = new Promise<Buffer>((resolve, reject) => {
    readFile(join(repository.path, path), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
  return p;
}
