import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { ChangeDisplay, WorkingFileChange } from '../models/workingfile';

@Injectable()
export class StatusService {

  getStatus(): Observable<WorkingFileChange[]> {
    return of([
      { path: 'path/to/file1', state: ChangeDisplay.Untracked },
      { path: 'path/to/日本語ファイル名', state: ChangeDisplay.Untracked },
      { path: 'path/to/file2', state: ChangeDisplay.Changed },
      { path: 'path/to/file3', state: ChangeDisplay.Deleted },
      { path: 'path/to/file4', state: ChangeDisplay.RenameedOrCopied },
    ]);
  }
}
