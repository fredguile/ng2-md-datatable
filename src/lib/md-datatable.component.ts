import {
  Component,
  AfterContentInit,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  ContentChildren,
  QueryList,
  forwardRef,
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';

import { IDatatableSelectionEvent, IDatatableSortEvent } from './md-datatable.interfaces';

import { BaseComponent } from './helpers';
import { MdDataTableHeaderComponent } from './md-datatable-header.component';
import { MdDataTableRowComponent } from './md-datatable-row.component';
import { MdDatatableStore } from './md-datatable.store';
import { MdDatatableActions } from './md-datatable.actions';

import {
  getCurrentSelection,
  getCurrentSort,
} from './md-datatable.reducer';

let instanceId = 0;

@Component({
  selector: 'ng2-md-datatable',
  template: `
    <table>
      <ng-content></ng-content>
    </table>
  `,
  styleUrls: ['md-datatable.component.scss']
})
export class MdDataTableComponent extends BaseComponent implements AfterContentInit {
  isSelectable = false;

  @Input()
  set selectable(val: any) {
    this.isSelectable = val !== 'false';
  }

  @Output() selectionChange: EventEmitter<IDatatableSelectionEvent>;
  @Output() sortChange: EventEmitter<IDatatableSortEvent>;

  @ContentChild(forwardRef(() => MdDataTableHeaderComponent)) headerCmp: MdDataTableHeaderComponent;
  @ContentChildren(forwardRef(() => MdDataTableRowComponent)) rowsCmp: QueryList<MdDataTableRowComponent>;

  id = `md-datatable-${instanceId++}`;

  constructor(
    private store: MdDatatableStore,
    private actions: MdDatatableActions,
  ) {
    super();
    this.selectionChange = new EventEmitter<IDatatableSelectionEvent>(true);
    this.sortChange = new EventEmitter<IDatatableSortEvent>(true);
  }

  ngAfterContentInit() {
    // when datatable is selectable, update state with selectable values from content
    if (this.isSelectable && this.headerCmp && this.rowsCmp) {
      const currentDatatableRows: MdDataTableRowComponent[] = this.rowsCmp.toArray();

      this.store.dispatch(
        this.actions.updateSelectableValues(this.id,
          currentDatatableRows.map((row: MdDataTableRowComponent) => row.selectableValue))
      );

      // subscribe to selection changes and emit IDatatableSelectionEvent
      this.store
        .let(getCurrentSelection(this.id))
        .skip(1)
        .takeUntil(this.unmount$)
        .subscribe(this.selectionChange);

      this.rowsCmp.changes
        .map((query: QueryList<MdDataTableRowComponent>) => query
          .toArray()
          .map((row: MdDataTableRowComponent) => row.selectableValue))
        .takeUntil(this.unmount$)
        .subscribe((selectableValues: string[]) => this.store.dispatch(
          this.actions.updateSelectableValues(this.id, selectableValues)));
    }

    // subscribe to sort changes and emit IDatatableSortEvent
    this.store
      .let(getCurrentSort(this.id))
      .takeUntil(this.unmount$)
      .subscribe(this.sortChange);
  }
}
