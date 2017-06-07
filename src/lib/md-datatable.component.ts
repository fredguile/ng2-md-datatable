/* tslint:disable:triple-equals */

import {
  Component,
  AfterContentInit,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  ContentChildren,
  QueryList,
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/takeUntil';

import { IDatatableSelectionEvent, IDatatableSortEvent } from './md-datatable.interfaces';

import { BaseComponent } from './helpers';
import { MdDataTableHeaderComponent } from './md-datatable-header.component';
import { MdDataTableRowComponent } from './md-datatable-row.component';
import { MdDatatableStore } from './md-datatable.store';
import { MdDatatableActions } from './md-datatable.actions';

import { getCurrentSelection, getCurrentSort } from './md-datatable.reducer';

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
    this.isSelectable = val == 'true';
  }

  @Output() selectionChange: EventEmitter<IDatatableSelectionEvent> =
    new EventEmitter<IDatatableSelectionEvent>(false);
  @Output() sortChange: EventEmitter<IDatatableSortEvent> =
    new EventEmitter<IDatatableSortEvent>(false);

  @ContentChild(MdDataTableHeaderComponent) headerCmp: MdDataTableHeaderComponent;
  @ContentChildren(MdDataTableRowComponent) rowsCmp: QueryList<MdDataTableRowComponent>;

  id = `md-datatable-${instanceId++}`;

  constructor(
    private store: MdDatatableStore,
    private actions: MdDatatableActions,
  ) {
    super();
  }

  ngAfterContentInit() {
    if (this.isSelectable && this.headerCmp && this.rowsCmp) {
      // when datatable is selectable, update state with selectable values from content
      this.store.dispatch(
        this.actions.updateSelectableValues(this.id,
          this.rowsCmp.toArray().map((row: MdDataTableRowComponent) => row.selectableValue))
      );

      // subscribe to selection changes and emit IDatatableSelectionEvent
      this.store
        .let(getCurrentSelection(this.id))
        .skip(1)
        .takeUntil(this.unmount$)
        .subscribe(this.selectionChange);

      // update state with selectable values upon changes
      this.rowsCmp.changes
        .map((query: QueryList<MdDataTableRowComponent>) => query
          .toArray()
          .map((row: MdDataTableRowComponent) => row.selectableValue))
        .distinctUntilChanged((values1: string[], values2: string[]) =>
          values1.length === values2.length && JSON.stringify(values1) === JSON.stringify(values2))
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
