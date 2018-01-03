import { Component, Input, OnInit } from '@angular/core';

import { AppStatusEntry, AppWorkingFileChange } from '../models/workingfile';
import { Hunk, HunkLine } from '../models/diff';

@Component({
  selector: 'app-hunk',
  templateUrl: './hunk.component.html',
  styleUrls: ['./hunk.component.css'],
})
export class HunkComponent implements OnInit {

  @Input() hunk: Hunk;
  @Input() fileChange: AppWorkingFileChange;

  /**
   * Whehter this hunk is editable. Supposed to be true when the file is a new
   * file and not allowed to edit the hunk.
   */
  editable: boolean;

  ngOnInit(): void {
    this.editable = this.fileChange.state !== AppStatusEntry.Added;
  }

  toggleHunkSelectState(hunk: Hunk) {
    if (!this.editable) {
      return;
    }

    const lines = hunk.lines;
    switch (hunk.selectedState) {
      case 'all':
        // to none
        lines
          .filter(l => l.type !== 'unchanged')
          .forEach(element => element.selected = false);
        break;
      case 'partial':
        // to none
        lines
          .filter(l => l.type !== 'unchanged')
          .forEach(element => element.selected = false);
        break;
      case 'none':
        // to all
        lines
          .filter(l => l.type !== 'unchanged')
          .forEach(element => element.selected = true);
        break;
      default:
        break;
    }

    this.setHunkState(hunk);
  }

  toggleSelected(line: HunkLine): void {
    if (!this.editable) {
      return;
    }
    
    line.selected = !line.selected;
    this.setHunkState(this.hunk);
  }

  setHunkState(hunk: Hunk) {
    hunk.selectedState = 'partial';

    // set header state
    let allTrue = true;
    let allFalse = true;
    const lines = this.hunk.lines;

    lines.forEach(l => {
      if (l.type === 'unchanged') {
        return;
      }
      if (l.selected) {
        allFalse = false;
      } else {
        allTrue = false;
      }
    });

    if (allTrue) {
      hunk.selectedState = 'all';
    } else if (allFalse) {
      hunk.selectedState = 'none';
    } else {
      hunk.selectedState = 'partial';
    }
  }
}
