import { Component, Input, OnInit } from '@angular/core';

import { Hunk, HunkLine } from '../models/diff';

@Component({
  selector: 'app-hunk',
  templateUrl: './hunk.component.html',
  styleUrls: ['./hunk.component.css'],
})
export class HunkComponent {

  @Input() hunk: Hunk;

  toggleHunkSelectState(hunk: Hunk) {
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
