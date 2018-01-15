import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material';
import { MatSnackBarModule } from '@angular/material';
import { MatMenuModule } from '@angular/material';

import { AppComponent } from './app.component';
import { NavComponent } from './subcomponents/nav.component';
import { RepositoryComponent } from './subcomponents/repository.component';
import { RepositoryListComponent } from './subcomponents/repository-list.component';
import { WorkingfileComponent } from './subcomponents/workingfile.component';
import { StatusComponent } from './subcomponents/status.component';
import { ChangeEntryComponent } from './subcomponents/change-entry.component';
import { CommitComponent } from './subcomponents/commit.component';
import { DiffComponent } from './subcomponents/diff.component';
import { HunkComponent } from './subcomponents/hunk.component';
import { BranchComponent } from './subcomponents/branch.component';
import { ErrorDialogComponent } from './subcomponents/error-dialog.component';
import { ConfirmationDialogComponent } from './subcomponents/confirmation-dialog.compoment';
import { LoggerService } from './services/logger.service';
import { ErrorService } from './services/error.service';
import { ConsoleLoggerService } from './services/consolelogger.service';
import { ConfigService } from './services/config.service';
import { StatusService } from './services/status.service';
import { RepositoryService } from './services/repository.service';
import { DiffService } from './services/diff.service';
import { CommitService } from './services/commit.service';
import { BranchService } from './services/branch.service';

import { DragDirective } from './directives/drag.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    RepositoryComponent,
    RepositoryListComponent,
    WorkingfileComponent,
    StatusComponent,
    ChangeEntryComponent,
    CommitComponent,
    DiffComponent,
    HunkComponent,
    BranchComponent,
    ErrorDialogComponent,
    ConfirmationDialogComponent,
    DragDirective
  ],
  entryComponents: [
    RepositoryComponent,
    BranchComponent,
    ErrorDialogComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/workingfiles',
        pathMatch: 'full',
      },
      {
        path: 'workingfiles',
        component: WorkingfileComponent,
      },
    ]),
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatTabsModule,
    MatCardModule,
    MatSnackBarModule,
    MatMenuModule
  ],
  providers: [
    { provide: LoggerService, useClass: ConsoleLoggerService },
    ErrorService,
    ConfigService,
    StatusService,
    RepositoryService,
    DiffService,
    CommitService,
    BranchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
