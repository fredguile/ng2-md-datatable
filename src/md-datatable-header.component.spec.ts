import { async, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';

import { MdDataTableHeaderComponent } from './md-datatable-header.component';
import { customFeatureStoreModule } from './helpers';
import { datatableReducer } from './md-datatable.reducer';
import { MdDatatableActions } from './md-datatable.actions';

describe('MdDataTableHeaderComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        customFeatureStoreModule(datatableReducer),
      ],
      declarations: [
        MdDataTableHeaderComponent,
      ],
      providers: [
        { provide: MdDatatableActions, useClass: MdDatatableActions },
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    let fixture = TestBed.createComponent(MdDataTableHeaderComponent);
    let instance = fixture.debugElement.componentInstance;
    expect(instance).toBeTruthy();
  }));
});
