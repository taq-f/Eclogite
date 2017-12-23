import { Component, OnInit } from '@angular/core';

import { AppStatusEntry, AppWorkingFileChange } from '../models/workingfile';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  stagedChanges: ReadonlyArray<AppWorkingFileChange>;
  unstagedChanges: ReadonlyArray<AppWorkingFileChange>;
  conflictedChanges: ReadonlyArray<AppWorkingFileChange>;

  selectedChange: AppWorkingFileChange;

  constructor(private statusService: StatusService) { }

  ngOnInit(): void {
    this.statusService.getStatus('').subscribe(fileChanges => {
      this.stagedChanges = fileChanges.staged;
      this.unstagedChanges = fileChanges.unstaged;
      this.conflictedChanges = fileChanges.conflicted;
    });
  }

  selectChange(c: AppWorkingFileChange) {
    this.selectedChange = c;
  }
}
