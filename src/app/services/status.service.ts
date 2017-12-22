import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { WorkingFileChange } from '../models/workingfile';

@Injectable()
export class StatusService {

  getStatus(): Observable<WorkingFileChange[]> {
    return of([
      { path: 'path/to/file1' },
      { path: 'path/to/file2' },
      { path: 'path/to/file3' },
    ]);
  }
}
