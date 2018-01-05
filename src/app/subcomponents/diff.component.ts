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
      this.fileDiff = undefined;
      this.getDiff();
    } else {
      this._workingfile = undefined;
      this.fileDiff = undefined;
    }
  }

  fileDiff: FileDiff;

  @Output() applied = new EventEmitter<undefined>();

  constructor(private diffService: DiffService) { }

  getDiff(): void {
    this.diffService.getDiff(
      this.repositoryPath,
      this._workingfile
    ).subscribe(fileDiff => {
      this.fileDiff = fileDiff;
    });
  }

  apply(hunk: Hunk = undefined): void {
    const patch = this.fileDiff.getPatch(hunk);
    this.diffService.applyPatch(this.repositoryPath, patch).subscribe(() => {
      this.applied.emit();
    });
  }
}
