import { NgModule } from "@angular/core";
import { MatButtonModule, MatIconModule } from "@angular/material";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatDataTableModule } from "ng2-md-datatable";

import { AppComponent } from "./app.component";
import { AppService } from "./app.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatIconModule,
    MatDataTableModule
  ],
  providers: [{ provide: AppService, useClass: AppService }],
  bootstrap: [AppComponent]
})
export class AppModule {}
