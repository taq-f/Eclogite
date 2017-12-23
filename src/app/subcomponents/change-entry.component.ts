import { Component, Input } from '@angular/core';

import { AppStatusEntry, AppWorkingFileChange } from '../models/workingfile';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-change-entry',
  templateUrl: './change-entry.component.html',
  styleUrls: ['./change-entry.component.css']
})
export class ChangeEntryComponent {
  @Input() change: AppWorkingFileChange;

  selected = false;

  toggleSelectState(): void {
    this.selected = !this.selected;
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
      case AppStatusEntry.RenamedOrCopied:
        return 'arrow_forward';
      case AppStatusEntry.Conflicted:
        return 'warning';
      default:
        throw new Error(`unknown status: {c}`);
    }
  }
}
