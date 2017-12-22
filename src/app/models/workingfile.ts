export enum ChangeDisplay {
  Untracked,
  Changed,
  Deleted,
  RenameedOrCopied,
}

/**
 * A working file change status which stands for application expression.
 */
export interface WorkingFileChange {
  /**
   * File path which basically relative path from repository root, since git
   * status command provide them that way.
   */
  readonly path: string;

  readonly state: ChangeDisplay;
}

/**
 * Expressing status entry provided by git status command.
 */
export interface StatusEntry {
  /**
   * A 2 character field describing unstaged and staged values.
   */
  readonly statusCode: string;
  readonly path: string;
  /**
   * An old path of renamed or copied entry.
   * It won't be present when the status is other than "renamed or copied".
   */
  readonly oldPath?: string;
}

