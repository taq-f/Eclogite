import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { fromPromise } from 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { LoggerService } from './logger.service';
import { RepositoryService } from './repository.service';
import { ErrorService } from './error.service';
import { getBranches, checkout, createBranch } from '../lib/git/branch';
import { Branch } from '../models/branch';

@Injectable()
export class BranchService {
  private currentBranch = new Subject<Branch>();
  currentBranch$ = this.currentBranch.asObservable();

  constructor(
    private logger: LoggerService,
    private repositoryService: RepositoryService,
    private errorService: ErrorService) { }

  setCurrentBranch(branch: Branch): void {
    this.logger.info('Branch change request:', branch.name);
    this.currentBranch.next(branch);
  }

  /**
   * Get a list of branches of the given repository. If repository is not
   * speficied, get a list of branches of the repository opened most recently.
   */
  branches(repositoryPath?: string): Observable<ReadonlyArray<Branch>> {
    if (repositoryPath) {
      return fromPromise(getBranches(repositoryPath));
    }

    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(getBranches(r.path)));
  }

  /**
   * Switch to the given branch. If repository is not specified, the repository
   * opened most recently will be used.
   */
  checkout(toBranch: Branch, repositoryPath?: string): Observable<Branch> {
    if (repositoryPath) {
      return fromPromise(checkout(repositoryPath, toBranch))
        .catch(error => {
          this.errorService.showGitError(error);
          return Observable.throw(error);
        });
    }

    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(checkout(r.path, toBranch)))
      .catch(error => {
        this.errorService.showGitError(error);
        return Observable.throw(error);
      });
  }

  /**
   *
   */
  createBranch(branchName: string, repositoryPath?: string): Observable<Branch> {
    if (repositoryPath) {
      return fromPromise(createBranch(repositoryPath, branchName))
        .catch(error => {
          this.errorService.showGitError(error);
          return Observable.throw(error);
        });
    }

    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(createBranch(r.path, branchName)))
      .catch(error => {
        this.errorService.showGitError(error);
        return Observable.throw(error);
      });
  }
}
