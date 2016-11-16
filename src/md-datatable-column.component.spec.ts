import { async, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';
import { MdDataTableColumnComponent } from './md-datatable-column.component';

describe('MdDatatableColumnCmp', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
      ],
      declarations: [
        MdDataTableColumnComponent,
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    let fixture = TestBed.createComponent(MdDataTableColumnComponent);
    let instance = fixture.debugElement.componentInstance;
    expect(instance).toBeTruthy();
  }));
});
