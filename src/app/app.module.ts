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

import { AppComponent } from './components/app.component';
import { NavComponent } from './components/nav/nav.component';
import { RepositoryComponent } from './components/repository/repository.component';
import { RepositoryListComponent } from './components/repository-list/repository-list.component';
import { WorkingfileComponent } from './components/workingfile/workingfile.component';
import { StatusComponent } from './components/status/status.component';
import { ChangeEntryComponent } from './components/change-entry/change-entry.component';
import { FilepathComponent } from './components/filepath/filepath.component';
import { CommitComponent } from './components/commit/commit.component';
import { DiffComponent } from './components/diff/diff.component';
import { HunkComponent } from './components/hunk/hunk.component';
import { BranchComponent } from './components/branch/branch.component';
import { ErrorDialogComponent } from './components/error-dialog/error-dialog.component';
import { DiscardChangeConfirmationDialogComponent } from './components/discard-change-confirmation-dialog/discard-change-confirmation-dialog.compoment';
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
import { RightClickDirective } from './directives/right-click.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    RepositoryComponent,
    RepositoryListComponent,
    WorkingfileComponent,
    StatusComponent,
    ChangeEntryComponent,
    FilepathComponent,
    CommitComponent,
    DiffComponent,
    HunkComponent,
    BranchComponent,
    ErrorDialogComponent,
    DiscardChangeConfirmationDialogComponent,
    DragDirective,
    RightClickDirective,
  ],
  entryComponents: [
    RepositoryComponent,
    BranchComponent,
    ErrorDialogComponent,
    DiscardChangeConfirmationDialogComponent
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
