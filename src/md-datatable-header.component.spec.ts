import { async, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';
import { MdDataTableHeaderComponent } from './md-datatable-header.component';

describe('MdDatatableHeaderCmp', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
      ],
      declarations: [
        MdDataTableHeaderComponent,
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    let fixture = TestBed.createComponent(MdDataTableHeaderComponent);
    let instance = fixture.debugElement.componentInstance;
    expect(instance).toBeTruthy();
  }));
});
