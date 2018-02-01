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
import { getCurrentBranch, getBranches, checkout, createBranch, deleteBranch } from '../lib/git/branch';
import { Repository } from '../models/repository';
import { Branch } from '../models/branch';

@Injectable()
export class BranchService {
  private currentBranch = new Subject<Branch>();
  currentBranch$ = this.currentBranch.asObservable();

  constructor(
    private logger: LoggerService,
    private repositoryService: RepositoryService,
    private errorService: ErrorService) { }

  /**
   * Inform checkout to subscribers.
   */
  setCurrentBranch(branch: Branch): void {
    this.logger.info('Branch change request:', branch.name);
    this.currentBranch.next(branch);
  }

  getCurrentBranch(repository?: Repository): Observable<Branch> {
    if (repository) {
      return fromPromise(getCurrentBranch(repository));
    }

    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(getCurrentBranch(r)));
  }

  /**
   * Get a list of branches of the given repository. If repository is not
   * speficied, get a list of branches of the repository opened most recently.
   */
  getBranches(repository?: Repository): Observable<ReadonlyArray<Branch>> {
    if (repository) {
      return fromPromise(getBranches(repository));
    }

    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(getBranches(r)));
  }

  /**
   * Switch to the given branch. If repository is not specified, the repository
   * opened most recently will be used.
   */
  checkout(toBranch: Branch, repository?: Repository): Observable<Branch> {
    if (repository) {
      return fromPromise(checkout(repository, toBranch))
        .catch(error => {
          this.errorService.showGitError(error);
          return Observable.throw(error);
        });
    }

    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(checkout(r, toBranch)))
      .catch(error => {
        this.errorService.showGitError(error);
        return Observable.throw(error);
      });
  }

  /**
   *
   */
  createBranch(branchName: string, repository?: Repository): Observable<Branch> {
    if (repository) {
      return fromPromise(createBranch(repository, branchName))
        .catch(error => {
          this.errorService.showGitError(error);
          return Observable.throw(error);
        });
    }

    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(createBranch(r, branchName)))
      .catch(error => {
        this.errorService.showGitError(error);
        return Observable.throw(error);
      });
  }

  deleteBranch(branch: Branch, repository?: Repository): Observable<Branch> {
    if (repository) {
      return fromPromise(deleteBranch(repository, branch))
        .catch(error => {
          this.errorService.showGitError(error);
          return Observable.throw(error);
        });
    }

    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(deleteBranch(r, branch)))
      .catch(error => {
        this.errorService.showGitError(error);
        return Observable.throw(error);
      });
  }
}
