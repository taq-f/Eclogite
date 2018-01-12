import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/concatMap';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { RepositoryService } from './repository.service';
import { AppStatusEntry, WorkingFileChange, AppWorkingFileChange } from '../models/workingfile';
import { commit } from '../lib/git/commit';

@Injectable()
export class CommitService {
  constructor(private repositoryService: RepositoryService) { }

  commit(message: string, repositoryPath?: string): Observable<undefined> {
    if (repositoryPath) {
      return fromPromise(commit(repositoryPath, message));
    }
    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(commit(r.path, message)));
  }
}
