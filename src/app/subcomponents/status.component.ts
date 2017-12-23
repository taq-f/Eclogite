import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import { AppStatusEntry, AppWorkingFileChange } from '../models/workingfile';
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
    this.statusService.getStatus('').subscribe(fileChanges => {
      this.stagedChanges = fileChanges.staged;
      this.unstagedChanges = fileChanges.unstaged;
      this.conflictedChanges = fileChanges.conflicted;
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
