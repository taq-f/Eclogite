import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { AppComponent } from './app.component';
import { RepositorySelectComponent } from './subcomponents/repository-select.component';
import { RepositoryAddComponent } from './subcomponents/repository-add.component';
import { StatusComponent } from './subcomponents/status.component';
import { ChangeEntryComponent } from './subcomponents/change-entry.component';

import { StatusService } from './services/status.service';
import { RepositoryService } from './services/repository.service';

@NgModule({
  declarations: [
    AppComponent,
    RepositorySelectComponent,
    RepositoryAddComponent,
    StatusComponent,
    ChangeEntryComponent
  ],
  entryComponents: [
    RepositorySelectComponent,
    RepositoryAddComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatListModule
  ],
  providers: [
    StatusService,
    RepositoryService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
