import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TagInputModule } from 'ng2-tag-input';

import { AppComponent, WriteClip, WriteNav, MathJaxDirective } from './app.component.js';

@NgModule({
  imports:      [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    TagInputModule
  ],
  declarations: [
    AppComponent,
    WriteClip,
    WriteNav,
    MathJaxDirective
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
