import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { branch } from '../lib/git/branch';
import { Branch } from '../models/branch';

@Injectable()
export class BranchService {
  branches(repositoryPath: string): Observable<ReadonlyArray<Branch>> {
    return fromPromise(branch(repositoryPath));
  }
}
