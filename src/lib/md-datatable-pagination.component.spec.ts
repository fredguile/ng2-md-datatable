import './rx-operators';
import { async, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { MdDataTablePaginationComponent } from './md-datatable-pagination.component';

describe('MdDataTablePaginationComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MaterialModule,
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
