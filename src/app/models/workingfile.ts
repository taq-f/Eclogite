/**
 * A working file change status.
 */
export interface WorkingFileChange {
  readonly path: string;
}

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

