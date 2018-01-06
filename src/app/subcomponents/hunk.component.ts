import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { AppStatusEntry, AppWorkingFileChange } from '../models/workingfile';
import { Hunk, HunkLine, SelectedState, setHunkState } from '../models/diff';

@Component({
  selector: 'app-hunk',
  templateUrl: './hunk.component.html',
  styleUrls: ['./hunk.component.css'],
  animations: [
    trigger('flyin', [
      state('in', style({ transform: 'translateX(0)' })),
      state('void', style({ transform: 'translateX(-100%)' })),
      transition(':enter', animate('0.2s ease-in')),
    ])
  ]
})
export class HunkComponent implements OnInit {

  @Input() hunk: Hunk;
  @Input() fileChange: AppWorkingFileChange;
  @Output() patch = new EventEmitter<Hunk>();
  @Output() hunkStatusChange = new EventEmitter<SelectedState>();

  /**
   * Whehter this hunk is editable. Supposed to be true when the file is a new
   * file and not allowed to edit the hunk.
   */
  editable: boolean;

  /**
   *
   */
  buttonText: string;
  buttonColor: string;

  private uneditableStates = new Set([
    AppStatusEntry.Added,
    AppStatusEntry.Deleted,
  ]);

  ngOnInit(): void {
    this.editable = !this.uneditableStates.has(this.fileChange.state);

    if (this.fileChange.indexState === 'unstaged') {
      this.buttonText = 'Stage Hunk';
      this.buttonColor = 'primary';
    } else if (this.fileChange.indexState === 'staged') {
      this.buttonText = 'Unstage Hunk';
      this.buttonColor = 'accent';
    } else {
      this.buttonText = undefined;
      this.buttonColor = undefined;
    }
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

    const currentState = hunk.selectedState;
    setHunkState(hunk);
    if (currentState !== hunk.selectedState) {
      this.hunkStatusChange.emit(hunk.selectedState);
    }
  }

  toggleSelected(line: HunkLine): void {
    if (!this.editable) {
      return;
    }

    line.selected = !line.selected;

    const currentState = this.hunk.selectedState;
    setHunkState(this.hunk);
    if (currentState !== this.hunk.selectedState) {
      this.hunkStatusChange.emit(this.hunk.selectedState);
    }
  }
}
