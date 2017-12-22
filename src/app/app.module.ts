import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { StatusComponent } from './subcomponents/status.component';

import { StatusService } from './services/status.service';

@NgModule({
  declarations: [
    AppComponent,
    StatusComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [StatusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
