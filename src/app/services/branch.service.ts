import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/concatMap';
import { RepositoryService } from './repository.service';
import { branch, checkout } from '../lib/git/branch';
import { Branch } from '../models/branch';

@Injectable()
export class BranchService {
  constructor(private repositoryService: RepositoryService) { }

  /**
   * Get a list of branches of the given repository. If repository is not
   * speficied, get a list of branches of the repository opened most recently.
   */
  branches(repositoryPath?: string): Observable<ReadonlyArray<Branch>> {
    if (repositoryPath) {
      return fromPromise(branch(repositoryPath));
    }
    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(branch(r.path)));
  }

  /**
   * Switch to the given branch. If repository is not specified, the repository
   * opened most recently will be used.
   */
  checkout(branchName: string, repositoryPath?: string): Observable<undefined> {
    if (repositoryPath) {
      return fromPromise(checkout(repositoryPath, branchName));
    }
    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(checkout(r.path, branchName)));
  }
}
