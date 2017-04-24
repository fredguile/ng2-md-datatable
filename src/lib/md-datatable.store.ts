import { Injectable, Inject, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { async } from 'rxjs/scheduler/async';
import 'rxjs/add/operator/observeOn';
import 'rxjs/add/operator/withLatestFrom';

import { IDatatablesState, IDatatableAction } from './md-datatable.interfaces';
import { DatatableReducer } from './md-datatable.reducer';

// For easing upgrading the library, I refrained myself of depending on @ngrx/store.
// I chose the alternative if implementing a Redux Store in just these 50 LOC.

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

export const STORE_INITIAL_STATE: InjectionToken<IDatatablesState> = new InjectionToken('ng2-md-datatable-test-initial-state');

@Injectable()
export class MdDatatableStore extends Observable<IDatatablesState> {
  private state$: BehaviorSubject<IDatatablesState>;

  constructor(
    private dispatcher$: MdDatatableDispatcher,
    @Inject(STORE_INITIAL_STATE) initialState: IDatatablesState,
    reducer: DatatableReducer,
  ) {
    super();
    this.state$ = new BehaviorSubject<IDatatablesState>(initialState);
    this.source = this.state$;

    this.dispatcher$
      .withLatestFrom(this.source)
      .observeOn(async)
      .subscribe(([action, state]) => this.state$.next(reducer.reduce(state, action)));
  }

  dispatch(action: IDatatableAction) {
    this.dispatcher$.dispatch(action);
  }
}
