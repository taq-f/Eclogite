import { Component, OnInit } from '@angular/core';

import { AppStatusEntry, AppWorkingFileChange } from '../models/workingfile';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {
  changes: ReadonlyArray<AppWorkingFileChange>;

  constructor(private statusService: StatusService) { }

  ngOnInit(): void {
    this.statusService.getStatus('').subscribe(fileChanges => {
      this.changes = fileChanges;
    });
  }

  /**
   * Convert status into Material icon text.
   */
  toIconText(c: AppStatusEntry): string {
    switch (c) {
      case AppStatusEntry.Added:
        return 'add_circle_outline';
      case AppStatusEntry.Modified:
        return 'check_circle';
      case AppStatusEntry.Deleted:
        return 'delete';
      case AppStatusEntry.RenameedOrCopied:
        return 'arrow_forward';
      case AppStatusEntry.Conflicted:
        return 'warning';
      default:
        throw new Error(`unknown status: {c}`);
    }
  }
}
