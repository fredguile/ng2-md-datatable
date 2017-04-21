import { InjectionToken } from '@angular/core';

import { IDatatablesState, IDatatableReducer } from './md-datatable.interfaces';

export const STORE_INITIAL_STATE: InjectionToken<IDatatablesState> =
  new InjectionToken('ng2-md-datatable-test-initial-state');
