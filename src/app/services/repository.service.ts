import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Repository } from '../models/repository';

@Injectable()
export class RepositoryService {

  getRepositories(): Observable<ReadonlyArray<Repository>> {
    return of([
      { name: 'Repo1', path: '/path/to/Repo1', exists: true },
      { name: 'Repo2', path: '/path/to/Repo2', exists: true },
      { name: 'Repo3', path: '/path/to/Repo3', exists: true },
    ]);
  }
}
