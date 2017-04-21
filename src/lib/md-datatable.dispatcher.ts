import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IDatatableAction } from './md-datatable.interfaces';

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
