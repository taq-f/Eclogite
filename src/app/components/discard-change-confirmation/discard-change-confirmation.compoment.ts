import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { WorkingFileChange } from '../../models/workingfile';

@Component({
  selector: 'app-discard-change-confirmation',
  templateUrl: './discard-change-confirmation.component.html',
  styleUrls: ['./discard-change-confirmation.component.scss'],
})
export class DiscardChangeConfirmationComponent {
  files: ReadonlyArray<WorkingFileChange>;

  constructor(
    public dialogRef: MatDialogRef<DiscardChangeConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { files: ReadonlyArray<WorkingFileChange> }
  ) {
    this.files = data.files;
  }
}
