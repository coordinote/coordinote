import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpModule } from '@angular/http';

import { TagInputModule } from 'ng2-tag-input';

import { AppComponent, WriteClip, WriteNav, ClipView, MathJaxDirective } from './app.component.js';

@NgModule({
  imports:      [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    TagInputModule
  ],
  declarations: [
    AppComponent,
    WriteClip,
    WriteNav,
    ClipView,
    MathJaxDirective
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
