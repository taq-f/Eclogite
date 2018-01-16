import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { RepositoryService } from './repository.service';
import { getDiff } from '../lib/git/diff';
import { applyPatch, unstage, discardChange } from '../lib/git/apply';
import { FileDiff, Hunk } from '../models/diff';
import { AppStatusEntry, AppWorkingFileChange } from '../models/workingfile';
import { Repository } from '../models/repository';

@Injectable()
export class DiffService {
  constructor(private repositoryService: RepositoryService) { }

  getDiff(
    fileChange: AppWorkingFileChange,
    repositoryPath?: string
  ): Observable<FileDiff> {
    if (repositoryPath) {
      return fromPromise(getDiff(repositoryPath, fileChange));
    }
    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(getDiff(r.path, fileChange)));
  }

  applyPatch(patch: string, repositoryPath?: string): Observable<undefined> {
    if (repositoryPath) {
      return fromPromise(applyPatch(repositoryPath, patch));
    }
    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(applyPatch(r.path, patch)));
  }

  unstageFile(path: string, repositoryPath?: string): Observable<undefined> {
    if (repositoryPath) {
      return fromPromise(unstage(repositoryPath, path));
    }
    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(unstage(r.path, path)));
  }

  discardChanges(file: AppWorkingFileChange, repository?: Repository): Observable<undefined> {
    if (repository) {
      return fromPromise(discardChange(repository, file));
    }
    return this.repositoryService.getLastOpenRepository()
      .concatMap(r => fromPromise(discardChange(r, file)));
  }
}
