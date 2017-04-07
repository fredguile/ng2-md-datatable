import {
  Component,
  AfterViewInit,
  Optional,
  Inject,
  forwardRef,
} from '@angular/core';

import { MdCheckboxChange } from '@angular/material';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { async } from 'rxjs/scheduler/async';

import { MdDataTableComponent } from './md-datatable.component';
import { MdDataTableColumnComponent } from './md-datatable-column.component';

import {
  IDatatablesState,
  IDatatableSelectionEvent,
  IDatatableSortEvent,
  DatatableSortType,
} from './md-datatable.interfaces';

import { BaseComponent, MD_DATATABLE_STORE } from './helpers';
import { areAllRowsSelected } from './md-datatable.reducer';
import { MdDatatableActions } from './md-datatable.actions';

@Component({
  selector: 'ng2-md-datatable-header',
  template: `
    <tr>
      <th *ngIf="selectable" class="md-data-check-cell">
        <md-checkbox [checked]="allChecked$ | async" (change)="onAllCheckedChange($event)"></md-checkbox>
      </th>
      <ng-content></ng-content>
    </tr>
  `,
  styleUrls: ['md-datatable-header.component.css']
})
export class MdDataTableHeaderComponent extends BaseComponent implements AfterViewInit {
  allChecked$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get selectable(): boolean {
    return this.table && this.table.isSelectable;
  }

  private datatableId: string;

  constructor(
    @Optional() @Inject(forwardRef(() => MdDataTableComponent)) private table: MdDataTableComponent,
    @Inject(MD_DATATABLE_STORE) private store: Store<IDatatablesState>,
    private actions: MdDatatableActions,
  ) {
    super();
  }

  ngAfterViewInit() {
    this.datatableId = this.table ? this.table.id : undefined;

    this.store
      .let(areAllRowsSelected(this.datatableId))
      .observeOn(async)
      .takeUntil(this.unmount$)
      .subscribe(this.allChecked$);
  }

  onAllCheckedChange(e: MdCheckboxChange) {
    this.store.dispatch(this.actions.toggleSelectAll(this.datatableId, e.checked));
  }
}
