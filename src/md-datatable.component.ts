import {
  Component,
  OnInit,
  AfterContentInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
  ContentChild,
  ContentChildren,
  QueryList
} from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import {
  IDatatableCheckEvent,
  IDatatableSelectionEvent,
  IDatatableSortEvent,
} from './md-datatable.interfaces';

import { MdDataTableHeaderComponent } from './md-datatable-header.component';
import { MdDataTableRowComponent } from './md-datatable-row.component';

@Component({
  selector: 'ng2-md-datatable',
  template: `
    <table>
      <ng-content></ng-content>
    </table>
  `,
  styleUrls: ['md-datatable.component.css']
})
export class MdDataTableComponent implements OnInit, AfterContentInit, OnDestroy {
  private _selectable = false;

  @Input()
  set selectable(val: boolean) {
    this._selectable = JSON.parse(String(val));
  }

  get selectable(): boolean { return this._selectable; };

  @Output() selectionChange: EventEmitter<IDatatableSelectionEvent>;
  @Output() sortChange: EventEmitter<IDatatableSortEvent>;

  private subscriptions: Subscription[];

  @ContentChild(MdDataTableHeaderComponent) header: MdDataTableHeaderComponent;
  @ContentChildren(MdDataTableRowComponent) rows: QueryList<MdDataTableRowComponent>;

  ngOnInit() {
    this.selectionChange = new EventEmitter<IDatatableSelectionEvent>(true); // async
    this.sortChange = new EventEmitter<IDatatableSortEvent>(true); // async
    this.subscriptions = [];
  }

  ngAfterContentInit() {
    // propagate header select-all-rows events
    if (this.selectable && this.header) {
      this.subscriptions.push(
        this.header.allChecked$
          .subscribe((allChecked: boolean) => this.onAllCheckedEvent.call(this, allChecked))
      );
    }

    // propagate header sort events
    if (this.header) {
      this.subscriptions.push(
        this.header.sort$.subscribe((sort: IDatatableSortEvent) => this.sortChange.emit(sort))
      );
    }

    // propagate row select events
    if (this.selectable && this.rows) {
      this.subscriptions.push(
        this.rows.changes
          .switchMap((changes: QueryList<MdDataTableRowComponent>) => changes.toArray())
          .filter((row: MdDataTableRowComponent) => row.selectable)
          .mergeMap((row: MdDataTableRowComponent) => row.check$)
          .filter((check: IDatatableCheckEvent) => check.propagate)
          .subscribe((check: IDatatableCheckEvent) => this.onRowCheckEvent.call(this, check))
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  private onRowCheckEvent(check: IDatatableCheckEvent) {
    this.selectionChange.emit({
      allRowsSelected: this.areAllRowsSelected(),
      selectedValues: this.getSelectedValues(),
    });
  }

  private onAllCheckedEvent(allChecked: boolean) {
    this.rows
      .toArray()
      .filter((row: MdDataTableRowComponent) => row.selectable && row.isChecked !== allChecked)
      .forEach((row: MdDataTableRowComponent) => row.setCheck(allChecked));

    this.selectionChange.emit({
      allRowsSelected: this.areAllRowsSelected(),
      selectedValues: this.getSelectedValues(),
    });
  }

  private getSelectedValues() {
    return this.rows
      .toArray()
      .filter((row: MdDataTableRowComponent) => row.isChecked)
      .map((row: MdDataTableRowComponent) => row.selectableValue);
  }

  private areAllRowsSelected() {
    const rows = this.rows.toArray();

    if (rows.length === 0) {
      return false;
    }

    return this.getSelectedValues().length === rows.length;
  }
}
