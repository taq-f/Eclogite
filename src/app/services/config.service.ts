import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { AppStatusEntry, WorkingFileChange, AppWorkingFileChange } from '../models/workingfile';
import { User } from '../models/user';
import { getUser } from '../lib/git/config';

@Injectable()
export class ConfigService {
  getUser(repositoryPath: string): Observable<User> {
    return fromPromise(getUser(repositoryPath));
  }
}
