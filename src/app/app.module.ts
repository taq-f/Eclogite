import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AppComponent } from './app.component';
import { RepositoryAddComponent } from './subcomponents/repository-add.component';
import { StatusComponent } from './subcomponents/status.component';
import { ChangeEntryComponent } from './subcomponents/change-entry.component';

import { StatusService } from './services/status.service';

@NgModule({
  declarations: [
    AppComponent,
    RepositoryAddComponent,
    StatusComponent,
    ChangeEntryComponent
  ],
  entryComponents: [
    RepositoryAddComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule
  ],
  providers: [StatusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
