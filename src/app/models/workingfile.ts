/**
 * A status code that git status command report.
 */
export enum GitStatusEntry {
  // M
  Modified,
  // A
  Added,
  // D
  Deleted,
  // R
  Renamed,
  // C
  Copied,
  // .
  Unchanged,
  // ?
  Untracked,
  // !
  Ignored,
  // U
  UpdatedButUnmerged,
}

/**
 * The file status as represented in this app.
 */
export enum AppStatusEntry {
  Added,
  Modified,
  Deleted,
  RenameedOrCopied,
  Conflicted,
}

/**
 * A working file change status which stands for application expression.
 */
export interface AppWorkingFileChange {
  /**
   * File path which basically relative path from repository root, since git
   * status command provide them that way.
   */
  readonly path: string;
  /**
   * Status entry that will be described in application.
   */
  readonly state: AppStatusEntry;
  readonly oldPath?: string;
}

/**
 * Expressing status entry provided by git status command.
 */
export interface StatusEntry {
  /**
   * A 2 character field describing unstaged and staged values.
   */
  readonly statusCode: string;
  /**
   * target file path.
   */
  readonly path: string;
  /**
   * An old path of renamed or copied entry.
   * It won't be present when the status is other than "renamed or copied".
   */
  readonly oldPath?: string;
}

/** The status for an ordinary changed entry */
interface OrdinaryEntry {
  readonly kind: 'ordinary';
  /** how we should represent the file in the application */
  readonly type: 'added' | 'modified' | 'deleted';
  /** the status of the index for this entry (if known) */
  readonly index?: GitStatusEntry;
  /** the status of the working tree for this entry (if known) */
  readonly workingTree?: GitStatusEntry;
}

/** The status for a renamed or copied entry */
interface RenamedOrCopiedEntry {
  readonly kind: 'renamed' | 'copied';
  /** the status of the index for this entry (if known) */
  readonly index?: GitStatusEntry;
  /** the status of the working tree for this entry (if known) */
  readonly workingTree?: GitStatusEntry;
}

/** The status for an unmerged entry */
interface UnmergedEntry {
  readonly kind: 'conflicted';
  /** the first character of the short code ("ours")  */
  readonly us: GitStatusEntry;
  /** the second character of the short code ("theirs")  */
  readonly them: GitStatusEntry;
}

/** The status for an unmerged entry */
interface UntrackedEntry {
  readonly kind: 'untracked';
}

/** The union of possible entries from the git status */
export type FileEntry =
  | OrdinaryEntry
  | RenamedOrCopiedEntry
  | UnmergedEntry
  | UntrackedEntry;

