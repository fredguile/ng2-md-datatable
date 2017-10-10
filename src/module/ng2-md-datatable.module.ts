import { CommonModule } from "@angular/common";
import { NgModule, Optional, SkipSelf } from "@angular/core";
import { FormsModule } from "@angular/forms";

import {
  MatButtonModule,
  MatCheckboxModule,
  MatIconModule,
  MatSelectModule
} from "@angular/material";

import { MatDataTableColumnComponent } from "../components/datatable-column.component";
import { MatDataTableHeaderComponent } from "../components/datatable-header.component";
import { MatDataTablePaginationComponent } from "../components/datatable-pagination.component";
import { MatDataTableRowComponent } from "../components/datatable-row.component";
import { MatDataTableComponent } from "../components/datatable.component";

import { Actions } from "../store/actions";
import { Dispatcher } from "../store/dispatcher";
import { Reducer } from "../store/reducer";

import {
  REDUX_DEVTOOLS_EXTENSION,
  reduxDevToolsExtensionFactory,
  Store,
  STORE_INITIAL_STATE
} from "../store/store";

@NgModule({
  declarations: [
    MatDataTableComponent,
    MatDataTableHeaderComponent,
    MatDataTableColumnComponent,
    MatDataTableRowComponent,
    MatDataTablePaginationComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule
  ],
  providers: [
    { provide: Actions, useClass: Actions },
    { provide: Dispatcher, useClass: Dispatcher },
    { provide: STORE_INITIAL_STATE, useValue: {} },
    {
      provide: REDUX_DEVTOOLS_EXTENSION,
      useFactory: reduxDevToolsExtensionFactory
    },
    { provide: Reducer, useClass: Reducer },
    { provide: Store, useClass: Store }
  ],
  exports: [
    MatDataTableComponent,
    MatDataTableHeaderComponent,
    MatDataTableColumnComponent,
    MatDataTableRowComponent,
    MatDataTablePaginationComponent
  ]
})
export class MatDataTableModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: MatDataTableModule
  ) {
    if (parentModule) {
      throw new Error(
        "MatDataTableModule already loaded; Import in root module only."
      );
    }
  }
}
