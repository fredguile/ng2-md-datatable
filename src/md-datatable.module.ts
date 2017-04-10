import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { Dispatcher, StoreModule, provideStore } from '@ngrx/store';

import { MdDataTableComponent } from './md-datatable.component';
import { MdDataTableHeaderComponent } from './md-datatable-header.component';
import { MdDataTableColumnComponent } from './md-datatable-column.component';
import { MdDataTableRowComponent } from './md-datatable-row.component';
import { MdDataTablePaginationComponent } from './md-datatable-pagination.component';
import { customFeatureStoreModule } from './helpers';
import { datatableReducer } from './md-datatable.reducer';
import { MdDatatableActions } from './md-datatable.actions';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    customFeatureStoreModule(datatableReducer),
  ],
  declarations: [
    MdDataTableComponent,
    MdDataTableHeaderComponent,
    MdDataTableColumnComponent,
    MdDataTableRowComponent,
    MdDataTablePaginationComponent,
  ],
  providers: [
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
