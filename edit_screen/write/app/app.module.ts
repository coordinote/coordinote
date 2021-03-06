import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { HttpModule } from '@angular/http'

import { TagInputModule } from 'ng2-tag-input'
import { DpDatePickerModule } from 'ng2-date-picker'

import { AppComponent, WriteClip, WriteNav, ClipView, MenuBar, MathJaxDirective, SafePipe } from './app.component.js'

@NgModule({
  imports:      [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    TagInputModule,
    DpDatePickerModule
  ],
  declarations: [
    AppComponent,
    WriteClip,
    WriteNav,
    ClipView,
    MenuBar,
    MathJaxDirective,
    SafePipe
  ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
