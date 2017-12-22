import { AppStatusEntry, AppWorkingFileChange, FileEntry, GitStatusEntry, StatusEntry } from '../../models/workingfile';

import { git } from './core';

/**
 * Retrieve the status of the repository.
 */
export async function getStatus(repositoryPath: string): Promise<ReadonlyArray<AppWorkingFileChange>> {
  const result = await git(
    ['status', '--untracked-files=all', '--branch', '--porcelain=2', '-z'],
    repositoryPath,
  );

  if (result.exitCode !== 0) {
    console.log('err', result.stderr);
    return;
  }

  return parseStatus(result.stdout).map(e => {
    const fileChange = toAppWorkingFileChange(mapStatus(e.statusCode));
    return {
      path: e.path,
      state: fileChange,
    };
  });
}

/**
 * Get view friendly working file status.
 */
function toAppWorkingFileChange(entry: FileEntry): AppStatusEntry {
  if (entry.kind === 'ordinary') {
    switch (entry.type) {
      case 'added':
        return AppStatusEntry.Untracked;
      case 'modified':
        return AppStatusEntry.Modified;
      case 'deleted':
        return AppStatusEntry.Deleted;
    }
  } else if (entry.kind === 'copied') {
    return AppStatusEntry.RenameedOrCopied;
  } else if (entry.kind === 'renamed') {
    return AppStatusEntry.RenameedOrCopied;
  } else if (entry.kind === 'conflicted') {
    return AppStatusEntry.Conflicted;
  } else if (entry.kind === 'untracked') {
    return AppStatusEntry.Untracked;
  }

  throw new Error(`Unknown file status ${entry}`);
}

/**
 * Parse "status" output into status entries.
 */
function parseStatus(output: string): ReadonlyArray<StatusEntry> {
  const entries = new Array<StatusEntry>();
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


/**
 * Conversion from a 2 letter statuscode into file entry.
 */
export function mapStatus(status: string): FileEntry {
  if (status === '??') {
    return {
      kind: 'untracked',
    };
  }

  if (status === '.M') {
    return {
      kind: 'ordinary',
      type: 'modified',
      index: GitStatusEntry.Unchanged,
      workingTree: GitStatusEntry.Modified,
    };
  }

  if (status === 'M.') {
    return {
      kind: 'ordinary',
      type: 'modified',
      index: GitStatusEntry.Modified,
      workingTree: GitStatusEntry.Unchanged,
    };
  }

  if (status === '.A') {
    return {
      kind: 'ordinary',
      type: 'added',
      index: GitStatusEntry.Unchanged,
      workingTree: GitStatusEntry.Added,
    };
  }

  if (status === 'A.') {
    return {
      kind: 'ordinary',
      type: 'added',
      index: GitStatusEntry.Added,
      workingTree: GitStatusEntry.Unchanged,
    };
  }

  if (status === '.D') {
    return {
      kind: 'ordinary',
      type: 'deleted',
      index: GitStatusEntry.Unchanged,
      workingTree: GitStatusEntry.Deleted,
    };
  }

  if (status === 'D.') {
    return {
      kind: 'ordinary',
      type: 'deleted',
      index: GitStatusEntry.Deleted,
      workingTree: GitStatusEntry.Unchanged,
    };
  }

  if (status === 'R.') {
    return {
      kind: 'renamed',
      index: GitStatusEntry.Renamed,
      workingTree: GitStatusEntry.Unchanged,
    };
  }

  if (status === '.R') {
    return {
      kind: 'renamed',
      index: GitStatusEntry.Unchanged,
      workingTree: GitStatusEntry.Renamed,
    };
  }

  if (status === 'C.') {
    return {
      kind: 'copied',
      index: GitStatusEntry.Copied,
      workingTree: GitStatusEntry.Unchanged,
    };
  }

  if (status === '.C') {
    return {
      kind: 'copied',
      index: GitStatusEntry.Unchanged,
      workingTree: GitStatusEntry.Copied,
    };
  }

  if (status === 'AD') {
    return {
      kind: 'ordinary',
      type: 'added',
      index: GitStatusEntry.Added,
      workingTree: GitStatusEntry.Deleted,
    };
  }

  if (status === 'AM') {
    return {
      kind: 'ordinary',
      type: 'added',
      index: GitStatusEntry.Added,
      workingTree: GitStatusEntry.Modified,
    };
  }

  if (status === 'RM') {
    return {
      kind: 'renamed',
      index: GitStatusEntry.Renamed,
      workingTree: GitStatusEntry.Modified,
    };
  }

  if (status === 'RD') {
    return {
      kind: 'renamed',
      index: GitStatusEntry.Renamed,
      workingTree: GitStatusEntry.Deleted,
    };
  }

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

  // as a fallback, we assume the file is modified in some way
  return {
    kind: 'ordinary',
    type: 'modified',
  };
}

// Private parsers *************************************************************

/**
 * 1 <XY> <sub> <mH> <mI> <mW> <hH> <hI> <path>
 */
function parseChangedEntry(field: string): StatusEntry {
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
function parsedRenamedOrCopiedEntry(field: string, oldPath: string): StatusEntry {
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
function parseUnmergedEntry(field: string): StatusEntry {
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
function parseUntrackedField(field: string): StatusEntry {
  return {
    statusCode: '??',
    path: field.substr(2),
  };
}
