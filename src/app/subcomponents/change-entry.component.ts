import { Component, Input } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

import { AppStatusEntry, AppWorkingFileChange } from '../models/workingfile';
import { StatusService } from '../services/status.service';

@Component({
  selector: 'app-change-entry',
  templateUrl: './change-entry.component.html',
  styleUrls: ['./change-entry.component.css'],
  animations: [
    trigger('select', [
      state('unselected', style({ backgroundColor: 'transparent' })),
      state('selected', style({ backgroundColor: '#CFD8DC' })),
      transition('unselected <=> selected', animate('200ms ease')),
    ])
  ]
})
export class ChangeEntryComponent {
  @Input() change: AppWorkingFileChange;

  @Input()
  set selected(v: boolean) {
    this.selectState = v ? 'selected' : 'unselected';
  }

  selectState = 'unselected';

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
