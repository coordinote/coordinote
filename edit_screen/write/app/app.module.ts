import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/plarform-browser';

import { AppComponent }   from 'edit_screen/write/app/app.component';

@NgModule({
  imports:      [BrowserModule],
  declaratuins: [AppComponent],
  bootstrap:    [AppComponent]
})
export class AppModule { }
