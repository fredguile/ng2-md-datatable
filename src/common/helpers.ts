import { OnDestroy } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

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
