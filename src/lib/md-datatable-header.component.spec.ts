import { async, TestBed } from '@angular/core/testing';
import { MdCheckboxModule } from '@angular/material';

import { MdDataTableHeaderComponent } from './md-datatable-header.component';
import {
  MdDatatableDispatcher,
  MdDatatableStore,
  STORE_INITIAL_STATE,
  STORE_REDUCER,
} from './md-datatable.store';
import { datatableReducer } from './md-datatable.reducer';
import { MdDatatableActions } from './md-datatable.actions';

describe('MdDataTableHeaderComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdCheckboxModule,
      ],
      declarations: [
        MdDataTableHeaderComponent,
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
    const fixture = TestBed.createComponent(MdDataTableHeaderComponent);
    const instance = fixture.debugElement.componentInstance;
    expect(instance).toBeTruthy();
  }));
});
