/**
 * A local repository.
 */
export interface Repository {
  readonly path: string;
  /**
   * Name of the repository, whitch normally directory name.
   */
  readonly name: string;
  readonly exists: boolean;
}
