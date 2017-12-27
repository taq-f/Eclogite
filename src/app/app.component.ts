import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';

import { RepositoryAddComponent } from './subcomponents/repository-add.component';
import { RepositorySelectComponent } from './subcomponents/repository-select.component';
import { Repository } from './models/repository';
import { AppWorkingFileChange } from './models/workingfile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  tabIndex = 1;
  repository: Repository = {
    path: '/path/to/the/repository',
    name: 'Repository1',
    exists: true,
  };
  filepath: string;

  constructor(public dialog: MatDialog) { }

  onEntrySelectChange(v: AppWorkingFileChange): void {
    this.filepath = v.path;
  }

  addRepository(): void {
    const dialogRef = this.dialog.open(RepositoryAddComponent)
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }

  selectRepository(): void {
    const dialogRef = this.dialog.open(RepositorySelectComponent)
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
    });
  }
}
