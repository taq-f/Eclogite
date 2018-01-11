import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoggerService } from './services/logger.service';
import { BranchComponent } from './subcomponents/branch.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private logger: LoggerService,
    private dialog: MatDialog
  ) {}

  showBranches(): void {
    this.logger.info('Show branches as dialog.');
    this.dialog.open(BranchComponent, {
      width: '500px',
      height: '80%',
    });
  }
}
