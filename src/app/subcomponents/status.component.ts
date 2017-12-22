import { Component, OnInit } from '@angular/core';

import { ChangeDisplay, WorkingFileChange } from '../models/workingfile';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  changes: WorkingFileChange[];

  constructor(private statusService: StatusService) { }

  ngOnInit(): void {
    this.statusService.getStatus().subscribe(fileChanges => {
      this.changes = fileChanges;
    });
  }

  /**
   * Convert status into Material icon text.
   */
  getIconText(c: ChangeDisplay): string {
    switch (c) {
      case ChangeDisplay.Untracked:
        return 'add_circle_outline';
      case ChangeDisplay.Changed:
        return 'change_history';
      case ChangeDisplay.Deleted:
        return 'delete';
      case ChangeDisplay.RenameedOrCopied:
        return 'arrow_forward';
      default:
        break;
    }
  }
}
