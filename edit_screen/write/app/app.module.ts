import { NgModule } from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent, WriteClip, WriteAside }   from './app.component.js';

@NgModule({
  imports:      [
    BrowserModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    WriteClip,
    WriteAside
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
