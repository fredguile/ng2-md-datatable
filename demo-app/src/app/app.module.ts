import { NgModule } from "@angular/core";
import { MdIconModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { MdDataTableModule } from "ng2-md-datatable";

import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, MdIconModule, MdDataTableModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
