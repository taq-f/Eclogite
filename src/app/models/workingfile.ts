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

export function mapStatusEntry(letter: string): GitStatusEntry {
  switch (letter) {
    case 'M':
      return GitStatusEntry.Modified;
    case 'A':
      return GitStatusEntry.Added;
    case 'D':
      return GitStatusEntry.Deleted;
    case 'R':
      return GitStatusEntry.Renamed;
    case 'C':
      return GitStatusEntry.Copied;
    case '.':
      return GitStatusEntry.Unchanged;
    case '?':
      return GitStatusEntry.Untracked;
    case '!':
      return GitStatusEntry.Ignored;
    case 'U':
      return GitStatusEntry.UpdatedButUnmerged;
    default:
      throw new Error(`unknown status: ${letter}`);
  }
}



/**
 * The file status as represented in this application.
 *
 * Both staged and unstaged file changes use these statuses in common.
 */
export enum AppStatusEntry {
  /**
   * Newly created (untracked) or already staged as new file.
   * Both cases should be represented as some "new" file.
   */
  Added,
  /**
   * Modilied in local (not staged yet) or modification staged.
   * Both cases should be represented as "the file is under git control,
   * but some modification which is not commited yet."
   */
  Modified,
  /**
   * Deleted file under git control (and not staged yet) or the deletion is
   * staged waiting for being commited.
   * Both cases should be represented as "the file is gone."
   */
  Deleted,
  /**
   * Normally two files are involved in this status; renamed or copied.
   * Should be aware that this cases won't happen before staging. It will be
   * expressed as "new file not under git control" and "deleted file." And once
   * put into index, it will be recognized as "moved" or "copied."
   */
  RenamedOrCopied,
  /**
   * When conflict occurs by, for example, merging (actions that another branch
   * is involved). You'll see "Conflicted" status.
   */
  Conflicted,
}

/**
 * Expressing status entry provided by git status command.
 *
 * This will be converted into AppWorkingFileChange in order to be used in views.
 */
export interface WorkingFileChange {
  /**
   * The target file path.
   */
  readonly path: string;
  /**
   * An old path of renamed or copied entry.
   * It won't be present when the status is other than "renamed or copied".
   */
  readonly oldPath?: string;
  /**
   * A 2 character field describing unstaged and staged values.
   */
  readonly statusCode: string;
}

/**
 * A working file change status which stands for application expression.
 */
export interface AppWorkingFileChange {
  /**
   * File path which basically relative path from repository root, since git
   * status command provide them that way.
   *
   * TODO better to split path and filename?
   */
  readonly path: string;
  readonly oldPath?: string;
  /**
   * Status entry that will be described in application.
   */
  readonly state: AppStatusEntry;
}

export interface OrdinaryEntry {
  readonly kind: 'ordinary';
  /** the status of the index for this entry (if known) */
  readonly index: GitStatusEntry;
  /** the status of the working tree for this entry (if known) */
  readonly workingTree: GitStatusEntry;
}

/** The status for an unmerged entry */
export interface UnmergedEntry {
  readonly kind: 'conflicted';
  /** the first character of the short code ("ours")  */
  readonly us: GitStatusEntry;
  /** the second character of the short code ("theirs")  */
  readonly them: GitStatusEntry;
}

/** The status for an unmerged entry */
export interface UntrackedEntry {
  readonly kind: 'untracked';
}

export type FileEntry =
  | OrdinaryEntry
  | UnmergedEntry
  | UntrackedEntry;
