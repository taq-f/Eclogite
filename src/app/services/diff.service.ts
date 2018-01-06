import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { getDiff } from '../lib/git/diff';
import { applyPatch, unstage } from '../lib/git/apply';
import { FileDiff, Hunk } from '../models/diff';
import { AppStatusEntry, AppWorkingFileChange } from '../models/workingfile';

@Injectable()
export class DiffService {
  getDiff(
    repositoryPath: string,
    fileChange: AppWorkingFileChange
  ): Observable<FileDiff> {
    return fromPromise(getDiff(repositoryPath, fileChange));
  }

  applyPatch(repositoryPath: string, patch: string): Observable<undefined> {
    return fromPromise(applyPatch(repositoryPath, patch));
  }

  unstageFile(repositoryPath: string, path: string): Observable<undefined> {
    return fromPromise(unstage(repositoryPath, path));
  }
}
