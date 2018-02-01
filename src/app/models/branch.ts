/**
 * Branch type expressing if the branch is local or remote.
 */
export type BranchType = 'local' | 'remote';

export interface Branch {
  /**
   * Branch name.
   */
  readonly name: string;
  /**
   * Is this a current branch?
   */
  readonly current?: boolean;
  /**
   * The upstream branch, if any.
   */
  readonly upstream?: string;
  /**
   * Branch type.
   */
  readonly type?: BranchType;
}
