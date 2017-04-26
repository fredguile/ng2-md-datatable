import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MdCheckboxModule, MdSelectModule, MdButtonModule, MdIconModule } from '@angular/material';

import { MdDataTableComponent } from './md-datatable.component';
import { MdDataTableHeaderComponent } from './md-datatable-header.component';
import { MdDataTableColumnComponent } from './md-datatable-column.component';
import { MdDataTableRowComponent } from './md-datatable-row.component';
import { MdDataTablePaginationComponent } from './md-datatable-pagination.component';

import {
  MdDatatableDispatcher,
  MdDatatableStore,
  STORE_INITIAL_STATE,
  REDUX_DEVTOOLS_EXTENSION,
  reduxDevToolsExtensionFactory,
} from './md-datatable.store';
import { DatatableReducer } from './md-datatable.reducer';
import { MdDatatableActions } from './md-datatable.actions';

@NgModule({
  declarations: [
    MdDataTableComponent,
    MdDataTableHeaderComponent,
    MdDataTableColumnComponent,
    MdDataTableRowComponent,
    MdDataTablePaginationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MdCheckboxModule,
    MdSelectModule,
    MdButtonModule,
    MdIconModule,
  ],
  providers: [
    { provide: MdDatatableDispatcher, useClass: MdDatatableDispatcher },
    { provide: STORE_INITIAL_STATE, useValue: {} },
    { provide: REDUX_DEVTOOLS_EXTENSION, useFactory: reduxDevToolsExtensionFactory },
    { provide: DatatableReducer, useClass: DatatableReducer },
    { provide: MdDatatableStore, useClass: MdDatatableStore },
    { provide: MdDatatableActions, useClass: MdDatatableActions },
  ],
  exports: [
    MdDataTableComponent,
    MdDataTableHeaderComponent,
    MdDataTableColumnComponent,
    MdDataTableRowComponent,
    MdDataTablePaginationComponent,
  ]
})
export class MdDataTableModule {
  constructor( @Optional() @SkipSelf() parentModule: MdDataTableModule) {
    if (parentModule) {
      throw new Error('MdDataTableModule already loaded; Import in root module only.');
    }
  }
}
