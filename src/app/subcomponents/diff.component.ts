import { Component, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { HunkComponent } from './hunk.component';
import { AppWorkingFileChange } from '../models/workingfile';
import { FileDiff, Hunk } from '../models/diff';
import { DiffService } from '../services/diff.service';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.css'],
})
export class DiffComponent {

  _workingfile: AppWorkingFileChange;

  @Input() repositoryPath: string;

  @Input()
  set workingfile(v: AppWorkingFileChange) {
    if (v) {
      this._workingfile = v;
      this.fileDiff = undefined;
      console.log('filepath change', v, this.repositoryPath);
      this.diffService.getDiff(
        this.repositoryPath,
        this._workingfile.path,
        this._workingfile.state,
      ).subscribe(fileDiff => {
          this.fileDiff = fileDiff;
        });
    }
  }

  fileDiff: FileDiff;

  constructor(private diffService: DiffService) { }

  addSelection(): void {
    const patch = this.fileDiff.getPatch();

    // TODO Communicate with patch service and apply the patch just created.
    //      Plus, need a FileDiff to hold all hunks and file information.
    console.log(patch);
  }
}
