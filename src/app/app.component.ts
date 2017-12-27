import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { RepositorySelectComponent } from './subcomponents/repository-select.component';
import { AppWorkingFileChange } from './models/workingfile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  repositoryPath = '';
  filepath: string;

  constructor(public dialog: MatDialog) { }

  onEntrySelectChange(v: AppWorkingFileChange): void {
    this.filepath = v.path;
  }

  selectRepository(): void {
    console.log("select");
    const dialogRef = this.dialog.open(RepositorySelectComponent)
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
