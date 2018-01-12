import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LoggerService } from './services/logger.service';
import { RepositoryComponent } from './subcomponents/repository.component';
import { BranchComponent } from './subcomponents/branch.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl']
})
export class AppComponent {

  constructor(
    private logger: LoggerService,
    private dialog: MatDialog
  ) { }

  showRepositories(): void {
    this.dialog.open(RepositoryComponent, {
      maxWidth: '90%',
      height: '100%',
    });
  }

  showBranches(): void {
    this.dialog.open(BranchComponent, {
      maxWidth: '90%',
      minWidth: '380px',
      height: '100%',
    });
  }
}
