import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { MdDataTableComponent } from './md-datatable.component';
import { MdDataTableHeaderComponent } from './md-datatable-header.component';
import { MdDataTableColumnComponent } from './md-datatable-column.component';
import { MdDataTableRowComponent } from './md-datatable-row.component';
import { MdDataTablePaginationComponent } from './md-datatable-pagination.component';
import {
  MdDatatableDispatcher,
  MdDatatableStore,
  STORE_INITIAL_STATE,
  STORE_REDUCER,
} from './md-datatable.store';
import { datatableReducer } from './md-datatable.reducer';
import { MdDatatableActions } from './md-datatable.actions';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
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
    { provide: STORE_INITIAL_STATE, useValue: {} },
    { provide: STORE_REDUCER, useValue: datatableReducer },
    { provide: MdDatatableStore, useClass: MdDatatableStore },
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
  static forRoot(): ModuleWithProviders {
    console.warn(`In the next version I'll deprecate MdDataTableModule::forRoot().
      Please import MdDataTableModule directly.`);

    return {
      ngModule: MdDataTableModule,
    };
  }

  constructor( @Optional() @SkipSelf() parentModule: MdDataTableModule) {
    if (parentModule) {
      throw new Error('MdDataTableModule already loaded; Import in root module only.');
    }
  }
}
