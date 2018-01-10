import { git, IGitResult } from './core';
import { User } from '../../models/user';

export async function getUser(
  repositoryPath: string
): Promise<User> {
  const result = await git(
    [
      'config',
      '--get-regexp',
      'user',
    ],
    repositoryPath,
  );

  if (result.exitCode !== 0) {
    // TODO
    console.log('err', result.stderr);
    return;
  }

  const data = result.stdout.split('\n').filter(v => v).map(line => {
    const elements = line.split(' ');
    return {
      key: elements[0],
      value: elements[1],
    };
  });

  return {
    name: data.find(d => d.key === 'user.name').value,
    email: data.find(d => d.key === 'user.email').value,
  };
}
