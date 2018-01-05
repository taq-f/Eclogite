import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AppStatusEntry, AppWorkingFileChange, IndexState } from '../models/workingfile';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  _repositoryPath: string;

  @Input()
  set repositoryPath(v: string) {
    this._repositoryPath = v;
  }

  /**
   * Changes entries that will be placed in unstaged changes.
   */
  unstagedChanges: ReadonlyArray<AppWorkingFileChange> = [];
  /**
   * Changes entries that will be placed in staged changes.
   */
  stagedChanges: ReadonlyArray<AppWorkingFileChange> = [];
  /**
   * Changes entries that will be placed in conflicted changes.
   */
  conflictedChanges: ReadonlyArray<AppWorkingFileChange> = [];

  /**
   * A currently selected change entry.
   */
  selectedChange: AppWorkingFileChange;

  /**
   * Event fires when selected change entry changed.
   */
  @Output() entrySelectChange = new EventEmitter<AppWorkingFileChange>();

  @Output() refreshed = new EventEmitter<{
    numOfUnstaged: number,
    numOfStaged: number,
    numOfConflicted: number,
  }>();

  /**
   * This component requires StatusService to retrieve file change entries.
   */
  constructor(private statusService: StatusService) { }

  ngOnInit(): void {
    this.getChanges();
  }

  getChanges() {
    this.statusService.getStatus(this._repositoryPath).subscribe(fileChanges => {
      const unstaged: AppWorkingFileChange[] = [];
      const staged: AppWorkingFileChange[] = [];
      const conflicted: AppWorkingFileChange[] = [];
      for (const f of fileChanges) {
        if (f.indexState === 'unstaged') {
          unstaged.push(f);
        } else if (f.indexState === 'staged') {
          staged.push(f);
        } else if (f.indexState === 'conflicted') {
          conflicted.push(f);
        }
      }

      this.unstagedChanges = unstaged;
      this.stagedChanges = staged;
      this.conflictedChanges = conflicted;

      // If there is a selected file, look for the corresponding file
      // and make it selected.
      if (this.selectedChange) {
        this.recoverSelected(this.selectedChange);
        this.entrySelectChange.emit(this.selectedChange);
      }

      this.refreshed.emit({
        numOfUnstaged: unstaged.length,
        numOfStaged: staged.length,
        numOfConflicted: conflicted.length,
      });
    });
  }

  recoverSelected(target: AppWorkingFileChange): void {
    let search: ReadonlyArray<AppWorkingFileChange>;
    switch (target.indexState) {
      case 'unstaged':
        search = this.unstagedChanges;
        break;
      case 'staged':
        search = this.stagedChanges;
        break;
      default:
        break;
    }

    const c = search.find(c => c.path === target.path);
    if (c) {
      this.selectedChange = c;
      return;
    }
    this.selectedChange = undefined;
  }


  /**
   * Select specified change entry.
   */
  selectChange(c: AppWorkingFileChange) {
    this.selectedChange = c;
    this.entrySelectChange.emit(c);
  }
}
