import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AppStatusEntry, AppWorkingFileChange, IndexState } from '../models/workingfile';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  /**
   * Changes entries that will be placed in unstaged changes.
   */
  unstagedChanges: ReadonlyArray<AppWorkingFileChange>;
  /**
   * Changes entries that will be placed in staged changes.
   */
  stagedChanges: ReadonlyArray<AppWorkingFileChange>;
  /**
   * Changes entries that will be placed in conflicted changes.
   */
  conflictedChanges: ReadonlyArray<AppWorkingFileChange>;

  /**
   * A currently selected change entry.
   */
  selectedChange: AppWorkingFileChange;

  /**
   * Event fires when selected change entry changed.
   */
  @Output() entrySelectChange = new EventEmitter<AppWorkingFileChange>();

  /**
   * This component requires StatusService to retrieve file change entries.
   */
  constructor(private statusService: StatusService) { }

  ngOnInit(): void {
    this.loadChanges('');
  }

  loadChanges(repositoryPath: string):void {
    this.statusService.getStatus('').subscribe(fileChanges => {
      let unstaged:AppWorkingFileChange[]  = [];
      let staged:AppWorkingFileChange[]  = [];
      let conflicted:AppWorkingFileChange[]  = [];
      for (const f of fileChanges) {
        if (f.indexState === 'unstaged') {
          unstaged.push(f);
        } else if (f.indexState === 'staged') {
          staged.push(f);
        } else if (f.indexState === 'conflicted') {
          conflicted.push(f);
        }
      }

      const sortFunc = (a:AppWorkingFileChange, b: AppWorkingFileChange) => {
        if (a.path > b.path) {
          return 1;
        } else if (a.path < b.path) {
          return -1;
        } else {
          return 0;
        }
      }

      unstaged = unstaged.sort(sortFunc);
      staged = staged.sort(sortFunc);
      conflicted = conflicted.sort(sortFunc);

      this.unstagedChanges = unstaged;
      this.stagedChanges = staged;
      this.conflictedChanges = conflicted;
    });
  }

  /**
   * Select specified change entry.
   */
  selectChange(c: AppWorkingFileChange) {
    this.selectedChange = c;
    this.entrySelectChange.emit(c);
  }
}
