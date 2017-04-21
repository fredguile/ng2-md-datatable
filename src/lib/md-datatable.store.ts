import { Injectable, Inject, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { async } from 'rxjs/scheduler/async';
import 'rxjs/add/operator/observeOn';
import 'rxjs/add/operator/withLatestFrom';

import { IDatatablesState, IDatatableAction } from './md-datatable.interfaces';
import { MdDatatableDispatcher } from './md-datatable.dispatcher';
import { STORE_INITIAL_STATE } from './md-datatable.tokens';
import { MdDatatableReducer } from './md-datatable.reducer';

// For easing upgrading the library, I refrained myself of depending on @ngrx/store.
// I chose the alternative if implementing a Redux Store in these just 15-20 LOC.

@Injectable()
export class MdDatatableStore extends Observable<IDatatablesState> {
  private state$: BehaviorSubject<IDatatablesState>;

  constructor(
    private dispatcher$: MdDatatableDispatcher,
    @Inject(STORE_INITIAL_STATE) @Optional() initialState: IDatatablesState,
    reducer: MdDatatableReducer,
  ) {
    super();
    this.state$ = new BehaviorSubject<IDatatablesState>(initialState || <IDatatablesState>{});
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
