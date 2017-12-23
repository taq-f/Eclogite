import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { AppStatusEntry, WorkingFileChange, AppWorkingFileChange } from '../models/workingfile';

import { getStatus } from '../lib/git/status';

@Injectable()
export class StatusService {

  getStatus(repositoryPath: string): Observable<ReadonlyArray<AppWorkingFileChange>> {
    // return fromPromise(
    //   getStatus(repositoryPath).then(entries => {
    //     console.log(entries);
    //     return entries;
    //   })
    // );

    return of([
      { path: 'path/to/added.txt', state: AppStatusEntry.Added },
      { path: 'path/to/日本語ファイル名', state: AppStatusEntry.Added },
      { path: 'path/to/すごく長いファイル名すごく長いファイル名すごく長いファイル名', state: AppStatusEntry.Added },
      { path: 'path/to/changed.txt', state: AppStatusEntry.Modified, oldPath: 'path/to/before.txt' },
      { path: 'path/to/deleted.txt', state: AppStatusEntry.Deleted },
      { path: 'path/to/renamed_or_copied.txt', state: AppStatusEntry.RenamedOrCopied },
      { path: 'path/to/conflicted.txt', state: AppStatusEntry.Conflicted },
    ]);
  }
}
