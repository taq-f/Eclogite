import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { AppStatusEntry, WorkingFileChange, AppWorkingFileChange } from '../models/workingfile';
import { commit } from '../lib/git/commit';

@Injectable()
export class CommitService {
  commit(repositoryPath: string, message: string): Observable<undefined> {
    return fromPromise(commit(repositoryPath, message));
  }
}
