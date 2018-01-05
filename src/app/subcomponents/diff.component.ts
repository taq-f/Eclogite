import { Component, EventEmitter, Input, Output } from '@angular/core';
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
      this.getDiff();
    } else {
      this._workingfile = undefined;
      this.fileDiff = undefined;
    }
  }

  /**
   * Emitted after patch has been applied successfully. Supposed to be used
   * to refresh other component.
   */
  @Output() applied = new EventEmitter<undefined>();

  /**
   * File diff retrieved from the working file change.
   */
  fileDiff: FileDiff;

  /**
   * Whether a patch can be created from the file diff. It depends on the
   * selection of lines in hunks.
   */
  editable = true;

  constructor(private diffService: DiffService) { }

  getDiff(): void {
    this.diffService.getDiff(
      this.repositoryPath,
      this._workingfile
    ).subscribe(fileDiff => {
      this.fileDiff = fileDiff;
    });
  }

  onHunkStatusChange(): void {
    const statuses = new Set(this.fileDiff.hunks.map(h => h.selectedState));
    if (statuses.size === 1 && statuses.has('none')) {
      this.editable = false
    } else {
      this.editable = true;
    }
  }

  apply(hunk: Hunk = undefined): void {
    const patch = this.fileDiff.getPatch(hunk);
    this.diffService.applyPatch(this.repositoryPath, patch).subscribe(() => {
      this.applied.emit();
    });
  }
}
