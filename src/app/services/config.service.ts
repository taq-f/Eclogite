import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/concatMap';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { AppStatusEntry, WorkingFileChange, AppWorkingFileChange } from '../models/workingfile';
import { RepositoryService } from './repository.service';
import { User } from '../models/user';
import { getUser } from '../lib/git/config';

@Injectable()
export class ConfigService {
  constructor(private repositoryService: RepositoryService) { }

  getUser(repositoryPath?: string): Observable<User> {
    if (repositoryPath) {
      return fromPromise(getUser(repositoryPath));
    }
    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(getUser(r.path)));
  }
}
