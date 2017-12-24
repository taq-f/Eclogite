import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RepositorySelectComponent } from './subcomponents/repository-select.component';
import { StatusComponent } from './subcomponents/status.component';
import { ChangeEntryComponent } from './subcomponents/change-entry.component';

import { StatusService } from './services/status.service';

@NgModule({
  declarations: [
    AppComponent,
    RepositorySelectComponent,
    StatusComponent,
    ChangeEntryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule
  ],
  providers: [StatusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
