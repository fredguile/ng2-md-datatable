import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { MdDataTableModule } from '../../../dist';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    MdDataTableModule.forRoot(),
  ],
  providers: [
    { provide: AppService, useClass: AppService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
