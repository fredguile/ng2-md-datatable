import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { MdDataTableModule } from '../../../../dist/ng2-md-datatable';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    MdDataTableModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
    { provide: AppService, useClass: AppService },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
