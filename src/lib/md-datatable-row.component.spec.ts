import './rx-operators';
import { async, TestBed } from '@angular/core/testing';
import { MaterialModule } from '@angular/material';

import { MdDataTableRowComponent } from './md-datatable-row.component';
import {
  MdDatatableDispatcher,
  MdDatatableStore,
  STORE_INITIAL_STATE,
  STORE_REDUCER,
} from './md-datatable.store';
import { datatableReducer } from './md-datatable.reducer';
import { MdDatatableActions } from './md-datatable.actions';

describe('MdDataTableRowComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MaterialModule,
      ],
      declarations: [
        MdDataTableRowComponent,
      ],
      providers: [
        { provide: STORE_INITIAL_STATE, useValue: {} },
        { provide: STORE_REDUCER, useValue: datatableReducer },
        { provide: MdDatatableDispatcher, useClass: MdDatatableDispatcher },
        { provide: MdDatatableStore, useClass: MdDatatableStore },
        { provide: MdDatatableActions, useClass: MdDatatableActions },
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(MdDataTableRowComponent);
    const instance = fixture.debugElement.componentInstance;
    expect(instance).toBeTruthy();
  }));
});
