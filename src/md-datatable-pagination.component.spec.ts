import { async, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';
import { MdDataTablePaginationComponent } from './md-datatable-pagination.component';

describe('MdDataTablePaginationComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
      ],
      declarations: [
        MdDataTablePaginationComponent,
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    let fixture = TestBed.createComponent(MdDataTablePaginationComponent);
    let instance = fixture.debugElement.componentInstance;
    expect(instance).toBeTruthy();
  }));
});
