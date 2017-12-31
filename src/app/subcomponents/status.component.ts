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
  unstagedChanges: AppWorkingFileChange[];
  /**
   * Changes entries that will be placed in staged changes.
   */
  stagedChanges: AppWorkingFileChange[];
  /**
   * Changes entries that will be placed in conflicted changes.
   */
  conflictedChanges: AppWorkingFileChange[];

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
