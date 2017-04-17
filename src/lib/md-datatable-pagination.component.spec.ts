import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MdSelectModule, MdButtonModule, MdIconModule } from '@angular/material';
import { MdDataTablePaginationComponent } from './md-datatable-pagination.component';

describe('MdDataTablePaginationComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MdSelectModule,
        MdButtonModule,
        MdIconModule,
      ],
      declarations: [
        MdDataTablePaginationComponent,
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(MdDataTablePaginationComponent);
    const instance = fixture.debugElement.componentInstance;
    expect(instance).toBeTruthy();
  }));
});
