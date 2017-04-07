import { async, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';

import { MdDataTableColumnComponent } from './md-datatable-column.component';
import { customFeatureStoreModule } from './helpers';
import { datatableReducer } from './md-datatable.reducer';
import { MdDatatableActions } from './md-datatable.actions';

describe('MdDataTableColumnComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        customFeatureStoreModule(datatableReducer),
      ],
      declarations: [
        MdDataTableColumnComponent,
      ],
      providers: [
        { provide: MdDatatableActions, useClass: MdDatatableActions },
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    let fixture = TestBed.createComponent(MdDataTableColumnComponent);
    let instance = fixture.debugElement.componentInstance;
    expect(instance).toBeTruthy();
  }));
});
