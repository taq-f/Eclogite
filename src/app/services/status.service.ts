import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { Subject } from 'rxjs/Subject';
import { Status } from '../models/status';
import { getStatus } from '../lib/git/status';

@Injectable()
export class StatusService {
  private statusChange = new Subject<Status>();
  statusChange$ = this.statusChange.asObservable();

  getStatus(repositoryPath: string): Observable<Status> {
    return fromPromise(getStatus(repositoryPath))
      .map(s => {
        this.statusChange.next(s);
        return s;
      });
  }
}
