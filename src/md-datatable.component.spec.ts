import { async, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';
import { MdDataTableComponent } from './md-datatable.component';

describe('MdDatatableCmp', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
      ],
      declarations: [
        MdDataTableComponent,
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    let fixture = TestBed.createComponent(MdDataTableComponent);
    let instance = fixture.debugElement.componentInstance;
    expect(instance).toBeTruthy();
  }));
});
