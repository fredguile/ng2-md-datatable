import { async, TestBed } from '@angular/core/testing';

import { MdDataTableComponent } from './md-datatable.component';
import { MdDatatableStore } from './md-datatable.store';
import { MdDatatableDispatcher } from './md-datatable.dispatcher';
import { MdDatatableReducer } from './md-datatable.reducer';
import { STORE_INITIAL_STATE } from './md-datatable.tokens';
import { MdDatatableActions } from './md-datatable.actions';

describe('MdDataTableComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        MdDataTableComponent,
      ],
      providers: [
        { provide: STORE_INITIAL_STATE, useValue: {} },
        { provide: MdDatatableDispatcher, useClass: MdDatatableDispatcher },
        { provide: MdDatatableStore, useClass: MdDatatableStore },
        { provide: MdDatatableReducer, useClass: MdDatatableReducer },
        { provide: MdDatatableActions, useClass: MdDatatableActions },
      ],
    }).compileComponents();
  }));

  it('should create the component', async(() => {
    const fixture = TestBed.createComponent(MdDataTableComponent);
    const instance = fixture.debugElement.componentInstance;
    expect(instance).toBeTruthy();
  }));
});
