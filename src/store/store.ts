import { Inject, Injectable, InjectionToken, Optional } from "@angular/core";
import "rxjs/add/operator/observeOn";
import "rxjs/add/operator/withLatestFrom";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { queue } from "rxjs/scheduler/queue";

import { LibState, ReduxDevTools } from "../common/interfaces";
import { Dispatcher } from "../store/dispatcher";
import { Reducer } from "../store/reducer";

// For easing upgrading the library, I refrained myself of depending on @ngrx/store.
// I chose the alternative of implementing a Redux Store in just these 50 LOC.

export const STORE_INITIAL_STATE: InjectionToken<
  LibState.IStates
> = new InjectionToken("ng2-md-datatable-test-initial-state");

export const REDUX_DEVTOOLS_EXTENSION: InjectionToken<
  ReduxDevTools.IExtension
> = new InjectionToken("redux-devtools");

export function reduxDevToolsExtensionFactory(): ReduxDevTools.IExtension | null {
  const REDUX_DEVTOOLS_KEY = "__REDUX_DEVTOOLS_EXTENSION__";

  return typeof window === "object" &&
    typeof window[REDUX_DEVTOOLS_KEY] === "function"
    ? (window[REDUX_DEVTOOLS_KEY] as ReduxDevTools.IExtension)
    : null;
}

@Injectable()
export class Store extends Observable<LibState.IStates> {
  private instanceId = `ng2-md-datatable-store-${Date.now()}`;
  private state$: BehaviorSubject<LibState.IStates>;

  constructor(
    private dispatcher$: Dispatcher,
    @Inject(STORE_INITIAL_STATE) initialState: LibState.IStates,
    reducer: Reducer,
    @Inject(REDUX_DEVTOOLS_EXTENSION)
    @Optional()
    reduxDevToolsExtension: ReduxDevTools.IExtension
  ) {
    super();

    this.state$ = new BehaviorSubject<LibState.IStates>(initialState);
    this.source = this.state$;
    let connection: ReduxDevTools.IConnection;

    if (reduxDevToolsExtension) {
      connection = reduxDevToolsExtension.connect({
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
          test: false
        }
      });
    }

    this.dispatcher$
      .withLatestFrom(this.source)
      .observeOn(queue)
      .subscribe(([action, state]) => {
        const newState: LibState.IStates = reducer.reduce(state, action);
        this.state$.next(newState);

        if (connection) {
          connection.send(action, newState, undefined, this.instanceId);
        }
      });
  }

  dispatch(action: LibState.IAction) {
    this.dispatcher$.dispatch(action);
  }
}
