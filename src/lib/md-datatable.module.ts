import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf,
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  MdCoreModule,
  A11yModule,
  MdCheckboxModule,
  MdInputModule,
  MdSelectModule,
  MdOptionModule,
  MdButtonModule,
  MdIconModule,
  MdRippleModule,
} from '@angular/material';

import { FormsModule } from '@angular/forms';

import { MdDataTableComponent } from './md-datatable.component';
import { MdDataTableHeaderComponent } from './md-datatable-header.component';
import { MdDataTableColumnComponent } from './md-datatable-column.component';
import { MdDataTableRowComponent } from './md-datatable-row.component';
import { MdDataTablePaginationComponent } from './md-datatable-pagination.component';
import { MdDatatableStore } from './md-datatable.store';
import { MdDatatableDispatcher } from './md-datatable.dispatcher';
import { MdDatatableReducer } from './md-datatable.reducer';
import { STORE_INITIAL_STATE } from './md-datatable.tokens';
import { IDatatablesState } from './md-datatable.interfaces';
import { MdDatatableActions } from './md-datatable.actions';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MdCoreModule,
    A11yModule,
    MdCheckboxModule,
    MdInputModule,
    MdSelectModule,
    MdOptionModule,
    MdButtonModule,
    MdIconModule,
    MdRippleModule,
  ],
  declarations: [
    MdDataTableComponent,
    MdDataTableHeaderComponent,
    MdDataTableColumnComponent,
    MdDataTableRowComponent,
    MdDataTablePaginationComponent,
  ],
  providers: [
    { provide: MdDatatableDispatcher, useClass: MdDatatableDispatcher },
    { provide: MdDatatableStore, useClass: MdDatatableStore },
    { provide: MdDatatableReducer, useClass: MdDatatableReducer },
    { provide: MdDatatableActions, useClass: MdDatatableActions },
  ],
  exports: [
    MdDataTableComponent,
    MdDataTableHeaderComponent,
    MdDataTableColumnComponent,
    MdDataTableRowComponent,
    MdDataTablePaginationComponent,
  ],
})
export class MdDataTableModule {
  constructor( @Optional() @SkipSelf() parentModule: MdDataTableModule) {
    if (parentModule) {
      throw new Error('MdDataTableModule already loaded; Import in root module only.');
    }
  }
}
