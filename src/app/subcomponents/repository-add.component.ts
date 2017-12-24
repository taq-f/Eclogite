import { Component, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { remote } from 'electron';

@Component({
  selector: 'app-repository-add',
  templateUrl: './repository-add.component.html',
  styleUrls: ['./repository-add.component.css'],
})
export class RepositoryAddComponent {

    repositoryPath = '';

    constructor(
        public dialogRef: MatDialogRef<RepositoryAddComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    openPathSelectDialog() {
        const path = remote.dialog.showOpenDialog({
            title: 'Repository Path',
            properties: ['openDirectory'],
        })
        if (!path) {
            return;
        }
        this.repositoryPath = path[0];
    }
}
