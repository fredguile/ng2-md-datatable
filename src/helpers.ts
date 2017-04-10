import { OpaqueToken, ModuleWithProviders, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { datatableReducer } from './md-datatable.reducer';

// I had to use these private things... :(
// Hope that this can be improved when @ngrx/store 4.x is releases
import {
  StoreModule,
  Store,
  Action,
  _reducerFactory,
  _stateFactory,
  _storeFactory,
} from '@ngrx/store';

import { IDatatablesState } from './md-datatable.interfaces';

class DatatableDispatcher extends BehaviorSubject<Action> {
  constructor() {
    super({ type: `ng2-md-datatable/store/${Date.now()}/init` });
  }

  dispatch(action: Action) {
    this.next(action);
  }

  complete() {
    // noop
  }
}

// Note that OpaqueToken are deprecated in Angular 4.x and this will have to be rewritten
export const MD_DATATABLE_STORE: OpaqueToken = new OpaqueToken('md-datatable');

// Pretty hacky way to create a "feature" store whose scope is limited to this library
// I guess I have to wait @ngrx/store v4.x to address this
export function customFeatureStoreModule(
  reducerFn: Function,
  initialState: IDatatablesState = {}): ModuleWithProviders {
  return {
    ngModule: StoreModule,
    providers: [{
      provide: MD_DATATABLE_STORE,
      useFactory: () => {
        const dispatcher = new DatatableDispatcher();
        const reducer = _reducerFactory(dispatcher, reducerFn);

        const store: Store<IDatatablesState> = _storeFactory(
          dispatcher,
          reducer,
          _stateFactory(initialState, dispatcher, reducer),
        );

        return store;
      },
    }],
  };
}

// static export (for AOT)
export const CustomFeatureStoreModule: ModuleWithProviders = customFeatureStoreModule(datatableReducer);

// I don't get why we don't have this unmount$ observable as default in Angular...
export abstract class BaseComponent implements OnDestroy {
  unmount$: Observable<void>;
  private unmountEmitter$: Subject<void> = new Subject<void>();

  constructor() {
    this.unmount$ = this.unmountEmitter$;
  }

  ngOnDestroy() {
    // we'll use this Observable completion to dispose subscriptions
    this.unmountEmitter$.next();
    this.unmountEmitter$.complete();
  }
}
