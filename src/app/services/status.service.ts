import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { AppStatusEntry, WorkingFileChange, AppWorkingFileChange } from '../models/workingfile';

import { getStatus } from '../lib/git/status';

@Injectable()
export class StatusService {
  getStatus(repositoryPath: string): Observable<ReadonlyArray<AppWorkingFileChange>> {
    return fromPromise(getStatus(repositoryPath));
  }
}
