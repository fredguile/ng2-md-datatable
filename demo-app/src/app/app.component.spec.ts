import { async, TestBed } from "@angular/core/testing";
import { MdIconModule } from "@angular/material";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { MdDataTableModule } from "ng2-md-datatable";

import { AppComponent } from "./app.component";
import { AppService } from "./app.service";

describe("AppComponent", () => {
  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        imports: [NoopAnimationsModule, MdIconModule, MdDataTableModule],
        declarations: [AppComponent],
        providers: [{ provide: AppService, useClass: AppService }]
      }).compileComponents();
    })
  );

  it(
    "should create the app",
    async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      const app = fixture.debugElement.componentInstance;
      expect(app).toBeTruthy();
    })
  );

  it(
    "should render title in a h1 tag",
    async(() => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement;
      expect(compiled.querySelector("h1").textContent).toContain(
        "Demo App: T-Shirts"
      );
    })
  );
});
