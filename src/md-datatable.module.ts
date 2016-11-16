import {
  NgModule,
  ModuleWithProviders,
  Optional,
  SkipSelf,
} from '@angular/core';

import { MaterialModule } from '@angular/material';

import { MdDataTableComponent } from './md-datatable.component';
import { MdDataTableColumnComponent } from './md-datatable-column.component';
import { MdDataTableHeaderComponent } from './md-datatable-header.component';
import { MdDataTablePaginationComponent } from './md-datatable-pagination.component';
import { MdDataTableRowComponent } from './md-datatable-row.component';

@NgModule({
  imports: [
    MaterialModule,
  ],
  declarations: [
    MdDataTableComponent,
    MdDataTableColumnComponent,
    MdDataTableHeaderComponent,
    MdDataTablePaginationComponent,
    MdDataTableRowComponent,
  ],
  exports: [
    MdDataTableComponent,
    MdDataTableColumnComponent,
    MdDataTableHeaderComponent,
    MdDataTablePaginationComponent,
    MdDataTableRowComponent,
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
