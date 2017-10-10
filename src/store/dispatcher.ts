import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import { LibState } from "../common/interfaces";

@Injectable()
export class Dispatcher extends BehaviorSubject<LibState.IAction> {
  static INIT = "ng2-md-datatable/store/init";

  constructor() {
    super({ datatableId: "", type: Dispatcher.INIT });
  }

  dispatch(action: LibState.IAction) {
    this.next(action);
  }
}
