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

import { AppComponent } from './app.component';
import { RepositoryComponent } from './subcomponents/repository.component';
import { RepositoryListComponent } from './subcomponents/repository-list.component';
import { WorkingfileComponent } from './subcomponents/workingfile.component';
import { StatusComponent } from './subcomponents/status.component';
import { ChangeEntryComponent } from './subcomponents/change-entry.component';
import { CommitComponent } from './subcomponents/commit.component';
import { DiffComponent } from './subcomponents/diff.component';
import { HunkComponent } from './subcomponents/hunk.component';
import { BranchComponent } from './subcomponents/branch.component';

import { ConfigService } from './services/config.service';
import { StatusService } from './services/status.service';
import { RepositoryService } from './services/repository.service';
import { DiffService } from './services/diff.service';
import { CommitService } from './services/commit.service';
import { BranchService } from './services/branch.service';

@NgModule({
  declarations: [
    AppComponent,
    RepositoryComponent,
    RepositoryListComponent,
    WorkingfileComponent,
    StatusComponent,
    ChangeEntryComponent,
    CommitComponent,
    DiffComponent,
    HunkComponent,
    BranchComponent
  ],
  entryComponents: [],
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
      {
        path: 'workingfiles/:repositoryId',
        component: WorkingfileComponent,
      },
      {
        path: 'repository',
        component: RepositoryComponent,
      },
      {
        path: 'branch',
        component: BranchComponent,
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
    MatCardModule
  ],
  providers: [
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
