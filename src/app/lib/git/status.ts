import {
  AppStatusEntry,
  AppWorkingFileChange,
  GitStatusEntry,
  mapStatusEntry,
  FileEntry,
  WorkingFileChange
} from '../../models/workingfile';

import { dirname, basename } from 'path';
import { git } from './core';

/**
 * Retrieve the status of the repository.
 */
export async function getStatus(
  repositoryPath: string
): Promise<ReadonlyArray<AppWorkingFileChange>> {
  const result = await git(
    ['status', '--untracked-files=all', '--branch', '--porcelain=2', '-z'],
    repositoryPath,
  );

  if (result.exitCode !== 0) {
    // TODO
    console.log('err', result.stderr);
    return;
  }

  // Prepare three types of changes, which should be categorized separatly.
  const entries: AppWorkingFileChange[] = [];

  for (const change of parseStatus(result.stdout)) {
    const entry = mapStatus(change.statusCode);
    const p = splitPath(change.path);

    if (entry.kind === 'untracked') {
      entries.push({
        path: p.path,
        dir: p.dir,
        filename: p.filename,
        sep: p.sep,
        oldPath: undefined,
        state: AppStatusEntry.Added,
        indexState: 'unstaged',
      });
      // The untracked file always falls into unstaged changes. Nothing else.
      continue;
    }

    if (entry.kind === 'conflicted') {
      entries.push({
        path: p.path,
        dir: p.dir,
        filename: p.filename,
        sep: p.sep,
        oldPath: undefined,
        state: AppStatusEntry.Conflicted,
        indexState: 'conflicted',
      });
      // The conflicted file always falls into conflicted changes. Nothing else.
      continue;
    }

    if (entry.kind === 'ordinary') {
      if (entry.index !== GitStatusEntry.Unchanged) {
        entries.push({
          path: p.path,
          dir: p.dir,
          filename: p.filename,
          sep: p.sep,
          oldPath: change.oldPath,
          state: toAppStatusEntry(entry.index),
          indexState: 'staged',
        });
      }
      if (entry.workingTree !== GitStatusEntry.Unchanged) {
        entries.push({
          path: p.path,
          dir: p.dir,
          filename: p.filename,
          sep: p.sep,
          oldPath: change.oldPath,
          state: toAppStatusEntry(entry.workingTree),
          indexState: 'unstaged',
        });
      }
    }
  }

  return entries;
}

/**
 * Parse "status" output into status entries.
 */
function parseStatus(output: string): ReadonlyArray<WorkingFileChange> {
  const entries = new Array<WorkingFileChange>();
  const fields = output.split('\0');

  let field: string | undefined;

  while ((field = fields.shift())) {
    if (isHeader(field)) {
      // TODO ignore headers now
      continue;
    }

    switch (getTypeMarker(field)) {
      case EntryTypeMarker.Changed:
        entries.push(parseChangedEntry(field));
        break;
      case EntryTypeMarker.RenamedOrCopied:
        entries.push(parsedRenamedOrCopiedEntry(field, fields.shift()));
        break;
      case EntryTypeMarker.Unmerged:
        entries.push(parseUnmergedEntry(field));
        break;
      case EntryTypeMarker.Untracked:
        entries.push(parseUntrackedField(field));
        break;
      // ignored entry should be another option, but we don't care it in this application.
    }
  }

  return entries;
}

/**
 * Get view friendly working file status.
 */
function toAppStatusEntry(entry: GitStatusEntry): AppStatusEntry {
  switch (entry) {
    case GitStatusEntry.Modified:
      return AppStatusEntry.Modified;
    case GitStatusEntry.Added:
      return AppStatusEntry.Added;
    case GitStatusEntry.Deleted:
      return AppStatusEntry.Deleted;
    case GitStatusEntry.Renamed:
      return AppStatusEntry.RenamedOrCopied;
    case GitStatusEntry.Copied:
      return AppStatusEntry.RenamedOrCopied;
    case GitStatusEntry.Untracked:
      return AppStatusEntry.Added;
    case GitStatusEntry.UpdatedButUnmerged:
      return AppStatusEntry.Conflicted;
  }
  throw new Error(`inappropriate git status entry: ${entry}`);
}

/**
 * Headers must start with "#" and branch information follow.
 */
function isHeader(field: string): boolean {
  return field.startsWith('# ') && field.length > 2;
}

/**
 * Entry type provided by git.
 */
enum EntryTypeMarker {
  Changed,
  RenamedOrCopied,
  Unmerged,
  Untracked,
}

/**
 * The first letter shows entry status.
 */
function getTypeMarker(field: string): EntryTypeMarker {
  switch (field.substr(0, 1)) {
    case '1':
      return EntryTypeMarker.Changed;
    case '2':
      return EntryTypeMarker.RenamedOrCopied;
    case 'u':
      return EntryTypeMarker.Unmerged;
    case '?':
      return EntryTypeMarker.Untracked;
  }
}

function splitPath(p: string): { path: string, dir: string, filename: string, sep: string } {
  return { path: p, dir: dirname(p), filename: basename(p), sep: '/' };
}

/**
 * Conversion from a 2 letter statuscode into file entry.
 */
function mapStatus(status: string): FileEntry {
  // Check obvious ones; conflicted.
  if (status === 'DD') {
    return {
      kind: 'conflicted',
      us: GitStatusEntry.Deleted,
      them: GitStatusEntry.Deleted,
    };
  }

  if (status === 'AU') {
    return {
      kind: 'conflicted',
      us: GitStatusEntry.Added,
      them: GitStatusEntry.Modified,
    };
  }

  if (status === 'UD') {
    return {
      kind: 'conflicted',
      us: GitStatusEntry.Modified,
      them: GitStatusEntry.Deleted,
    };
  }

  if (status === 'UA') {
    return {
      kind: 'conflicted',
      us: GitStatusEntry.Modified,
      them: GitStatusEntry.Added,
    };
  }

  if (status === 'DU') {
    return {
      kind: 'conflicted',
      us: GitStatusEntry.Deleted,
      them: GitStatusEntry.Modified,
    };
  }

  if (status === 'AA') {
    return {
      kind: 'conflicted',
      us: GitStatusEntry.Added,
      them: GitStatusEntry.Added,
    };
  }

  if (status === 'UU') {
    return {
      kind: 'conflicted',
      us: GitStatusEntry.Modified,
      them: GitStatusEntry.Modified,
    };
  }

  // And untracked files are obvious too.
  if (status === '??') {
    return {
      kind: 'untracked',
    };
  }

  // From here inspect X and Y parameter
  const x = mapStatusEntry(status.slice(0, 1));
  const y = mapStatusEntry(status.slice(1, 2));

  return {
    kind: 'ordinary',
    index: x,
    workingTree: y,
  };
}


// Private parsers *************************************************************

/**
 * 1 <XY> <sub> <mH> <mI> <mW> <hH> <hI> <path>
 */
function parseChangedEntry(field: string): WorkingFileChange {
  const changedEntryRe = /^1 ([MADRCUTX?!.]{2}) (N\.\.\.|S[C.][M.][U.]) (\d+) (\d+) (\d+) ([a-f0-9]+) ([a-f0-9]+) ([\s\S]*?)$/;
  const match = changedEntryRe.exec(field);
  if (!match) {
    throw new Error(`Failed to parse status line for changed entry: ${field}`);
  }

  return {
    statusCode: match[1],
    path: match[8],
  };
}

/**
 * 2 <XY> <sub> <mH> <mI> <mW> <hH> <hI> <X><score> <path><sep><origPath>
 */
function parsedRenamedOrCopiedEntry(field: string, oldPath: string): WorkingFileChange {
  const renamedOrCopiedEntryRe = /^2 ([MADRCUTX?!.]{2}) (N\.\.\.|S[C.][M.][U.]) (\d+) (\d+) (\d+) ([a-f0-9]+) ([a-f0-9]+) ([RC]\d+) ([\s\S]*?)$/;
  const match = renamedOrCopiedEntryRe.exec(field);
  if (!match) {
    throw new Error(`Failed to parse status line for unmerged entry: ${field}`);
  }
  if (!oldPath) {
    throw new Error('Old path not found in renamed or copied entry.');
  }

  return {
    statusCode: match[1],
    path: match[9],
    oldPath,
  };
}

/**
 * u <xy> <sub> <m1> <m2> <m3> <mW> <h1> <h2> <h3> <path>
 */
function parseUnmergedEntry(field: string): WorkingFileChange {
  const unmergedEntryRe = /^u ([DAU]{2}) (N\.\.\.|S[C.][M.][U.]) (\d+) (\d+) (\d+) (\d+) ([a-f0-9]+) ([a-f0-9]+) ([a-f0-9]+) ([\s\S]*?)$/;
  const match = unmergedEntryRe.exec(field);
  if (!match) {
    throw new Error(`Failed to parse status line for unmerged entry: ${field}`);
  }

  return {
    statusCode: match[1],
    path: match[10],
  };
}

/**
 * ? path/to/file
 */
function parseUntrackedField(field: string): WorkingFileChange {
  return {
    statusCode: '??',
    path: field.substr(2),
  };
}
