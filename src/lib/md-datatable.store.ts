import { Injectable, Inject, Optional, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { async } from 'rxjs/scheduler/async';
import 'rxjs/add/operator/observeOn';
import 'rxjs/add/operator/withLatestFrom';

import {
  IDatatablesState,
  IDatatableAction,
  IReduxDevToolsExtension,
  IReduxDevToolsConnection,
} from './md-datatable.interfaces';

import { DatatableReducer } from './md-datatable.reducer';

// For easing upgrading the library, I refrained myself of depending on @ngrx/store.
// I chose the alternative of implementing a Redux Store in just these 50 LOC.

export const STORE_INITIAL_STATE: InjectionToken<IDatatablesState> =
  new InjectionToken('ng2-md-datatable-test-initial-state');

export const REDUX_DEVTOOLS_EXTENSION: InjectionToken<IReduxDevToolsExtension> =
  new InjectionToken('redux-devtools');

export function reduxDevToolsExtensionFactory(): IReduxDevToolsExtension | null {
  const REDUX_DEVTOOLS_KEY = '__REDUX_DEVTOOLS_EXTENSION__';

  return typeof (window) === 'object' &&
    typeof (window[REDUX_DEVTOOLS_KEY]) === 'function' ?
    <IReduxDevToolsExtension>window[REDUX_DEVTOOLS_KEY] : null;
}

@Injectable()
export class MdDatatableDispatcher extends BehaviorSubject<IDatatableAction> {
  static INIT = 'ng2-md-datatable/store/init';

  constructor() {
    super({ datatableId: '', type: MdDatatableDispatcher.INIT });
  }

  dispatch(action: IDatatableAction) {
    this.next(action);
  }
}

@Injectable()
export class MdDatatableStore extends Observable<IDatatablesState> {
  private instanceId = `ng2-md-datatable-store-${Date.now()}`;
  private state$: BehaviorSubject<IDatatablesState>;

  constructor(
    private dispatcher$: MdDatatableDispatcher,
    @Inject(STORE_INITIAL_STATE) initialState: IDatatablesState,
    reducer: DatatableReducer,
    @Inject(REDUX_DEVTOOLS_EXTENSION) @Optional() reduxDevToolsExtension: IReduxDevToolsExtension,
  ) {
    super();

    this.state$ = new BehaviorSubject<IDatatablesState>(initialState);
    this.source = this.state$;
    let reduxDevToolsConnection: IReduxDevToolsConnection;

    if (reduxDevToolsExtension) {
      reduxDevToolsConnection = reduxDevToolsExtension.connect({
        name: this.instanceId,
        features: {
          pause: false,
          lock: false,
          persist: false,
          export: true,
          import: false,
          jump: false,
          skip: false,
          reorder: false,
          dispatch: false,
          test: false,
        },
      });
    }

    this.dispatcher$
      .withLatestFrom(this.source)
      .observeOn(async)
      .subscribe(([action, state]) => {
        const newState: IDatatablesState = reducer.reduce(state, action);
        this.state$.next(newState);

        if (reduxDevToolsConnection) {
          reduxDevToolsConnection.send(action, newState, undefined, this.instanceId);
        }
      });
  }

  dispatch(action: IDatatableAction) {
    this.dispatcher$.dispatch(action);
  }
}
