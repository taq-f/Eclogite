import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WorkingFileChange } from '../../models/workingfile';

@Component({
  selector: 'app-discard-change-confirmation-dialog',
  templateUrl: './discard-change-confirmation-dialog.component.html',
  styleUrls: ['./discard-change-confirmation-dialog.component.styl'],
})
export class DiscardChangeConfirmationDialogComponent {
  files: ReadonlyArray<WorkingFileChange>;

  constructor(
    public dialogRef: MatDialogRef<DiscardChangeConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { files: ReadonlyArray<WorkingFileChange> }
  ) {
    this.files = data.files;
  }
}
