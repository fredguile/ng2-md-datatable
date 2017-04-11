import { Injectable, Inject, OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { queue } from 'rxjs/scheduler/queue';

import { IDatatablesState, IDatatableAction, IDatatableReducer } from './md-datatable.interfaces';

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

export const STORE_INITIAL_STATE: OpaqueToken = new OpaqueToken('ng2-md-datatable-test-initial-state');
export const STORE_REDUCER: OpaqueToken = new OpaqueToken('ng2-md-datatable-test-reducer');

@Injectable()
export class MdDatatableStore extends Observable<IDatatablesState> {
  private state$: BehaviorSubject<IDatatablesState>;

  constructor(
    private dispatcher$: MdDatatableDispatcher,
    @Inject(STORE_INITIAL_STATE) initialState: IDatatablesState,
    @Inject(STORE_REDUCER) reducer: IDatatableReducer,
  ) {
    super();
    this.state$ = new BehaviorSubject<IDatatablesState>(initialState);
    this.source = this.state$;

    this.dispatcher$
      .observeOn(queue)
      .withLatestFrom(this.source)
      .subscribe(([action, state]) => this.state$.next(reducer(state, action)));
  }

  dispatch(action: IDatatableAction) {
    this.dispatcher$.dispatch(action);
  }
}
