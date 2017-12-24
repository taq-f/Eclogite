import { Component, Inject } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-repository-add',
  templateUrl: './repository-add.component.html',
  styleUrls: ['./repository-add.component.css'],
})
export class RepositoryAddComponent {

    constructor(
        public dialogRef: MatDialogRef<RepositoryAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    openPathSelectDialog() {
        console.log('path select');
    }
}
 

