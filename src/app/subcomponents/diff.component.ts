import { Component, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { HunkComponent } from './hunk.component';

import { FileDiff, Hunk } from '../models/diff';
import { DiffService } from '../services/diff.service';

@Component({
  selector: 'app-diff',
  templateUrl: './diff.component.html',
  styleUrls: ['./diff.component.css'],
})
export class DiffComponent {

  _filepath: string;

  @Input() repositoryPath: string;

  @Input()
  set filepath(v: string) {
    if (v) {
      this._filepath = v;
      this.fileDiff = undefined;
      console.log('filepath change', v, this.repositoryPath);
      this.diffService.getDiff(
        this.repositoryPath,
        this._filepath).subscribe(fileDiff => {
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
