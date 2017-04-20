import {
  Component,
  OnInit,
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
import 'rxjs/add/operator/takeUntil';

import {
  IDatatablesState,
  IDatatableSelectionEvent,
  IDatatableSortEvent,
} from './md-datatable.interfaces';

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
  styleUrls: ['md-datatable.component.css']
})
export class MdDataTableComponent extends BaseComponent implements OnInit, AfterContentInit {
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

  ngOnInit() {
    // if selectable, subscribe to selection changes and emit IDatatableSelectionEvent
    if (this.isSelectable) {
      this.store
        .let(getCurrentSelection(this.id))
        .subscribe(this.selectionChange);
    }

    // subscribe to sort changes and emit IDatatableSortEvent
    this.store
      .let(getCurrentSort(this.id))
      .subscribe(this.sortChange);
  }

  ngAfterContentInit() {
    // when datatable is selectable, update state with selectable values from content
    if (this.isSelectable && this.rowsCmp) {
      this.store.dispatch(
        this.actions.updateSelectableValues(this.id,
          this.rowsCmp.toArray().map((row: MdDataTableRowComponent) => row.selectableValue))
      );

      this.rowsCmp.changes
        .map((query: QueryList<MdDataTableRowComponent>) => query
          .toArray()
          .map((row: MdDataTableRowComponent) => row.selectableValue))
        .takeUntil(this.unmount$)
        .subscribe((selectableValues: string[]) => this.store.dispatch(
          this.actions.updateSelectableValues(this.id, selectableValues)));
    }
  }
}
