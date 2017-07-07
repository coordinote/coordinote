import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent, WriteClip, WriteNav }   from './app.component.js';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    WriteClip,
    WriteNav
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
