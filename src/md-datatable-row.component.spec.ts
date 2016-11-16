import { async, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';
import { MdDataTableRowComponent } from './md-datatable-row.component';

describe('MdDatatableRowCmp', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
      ],
      declarations: [
        MdDataTableRowComponent,
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    let fixture = TestBed.createComponent(MdDataTableRowComponent);
    let instance = fixture.debugElement.componentInstance;
    expect(instance).toBeTruthy();
  }));
});
