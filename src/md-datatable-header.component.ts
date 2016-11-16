import {
  Component,
  Output,
  OnInit,
  AfterContentInit,
  ContentChildren,
  QueryList,
  EventEmitter,
  OnDestroy,
  Optional,
  Inject,
  forwardRef
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { IDatatableSelectionEvent, IDatatableSortEvent, DatatableSortType } from './md-datatable.interfaces';
import { MdDataTableComponent } from './md-datatable.component';
import { MdDataTableColumnComponent } from './md-datatable-column.component';

@Component({
  selector: 'app-md-datatable-header',
  template: `
    <tr>
      <th *ngIf="selectable" class="md-data-check-cell">
        <md-checkbox [checked]="allChecked$ | async" (click)="clickCheckAll($event)"></md-checkbox>
      </th>
      <ng-content></ng-content>
    </tr>
  `,
  styleUrls: ['md-datatable-header.component.css']
})
export class MdDataTableHeaderComponent implements OnInit, AfterContentInit, OnDestroy {
  @Output() allChecked$: BehaviorSubject<boolean>;
  @Output() sort$: BehaviorSubject<IDatatableSortEvent>;

  @ContentChildren(MdDataTableColumnComponent) columns: QueryList<MdDataTableColumnComponent>;

  get selectable(): boolean {
    return this.table && this.table.selectable;
  }

  private subscriptions: Subscription[];

  constructor(
    @Optional() @Inject(forwardRef(() => MdDataTableComponent)) private table: MdDataTableComponent,
  ) { }

  ngOnInit() {
    this.allChecked$ = new BehaviorSubject(false);
    this.sort$ = new BehaviorSubject(null);
    this.subscriptions = [];

    // update allChecked$ when all rows get checked or unchecked
    if (this.selectable) {
      this.subscriptions.push(
        this.table.selectionChange
          .map((event: IDatatableSelectionEvent) => event.allRowsSelected)
          .distinctUntilChanged()
          .filter((allRowsSelected: boolean) => allRowsSelected !== this.allChecked$.getValue())
          .subscribe((allRowsSelected: boolean) =>
            this.allChecked$.next(allRowsSelected)
          )
      );
    }
  }

  ngAfterContentInit() {
    // subscribe to sort events when clicking on columns
    this.columns
      .toArray()
      .filter((column: MdDataTableColumnComponent) => column.sortable)
      .map((column: MdDataTableColumnComponent) => column.sortBy)
      .forEach((sortByEmitter: EventEmitter<string>) => this.subscriptions.push(
        sortByEmitter.subscribe((sortBy: string) => this.onSortByEvent.call(this, sortBy))
      ));
  }

  clickCheckAll(event: MouseEvent) {
    event.preventDefault();
    this.allChecked$.next(!this.allChecked$.getValue());
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }

  private onSortByEvent(sortBy: string) {
    const currentSort = this.sort$.getValue();

    // when first sorting or sorting a different column
    if (!currentSort || currentSort.sortBy !== sortBy) {
      return this.sort$.next({
        sortBy,
        sortType: DatatableSortType.Ascending,
      });
    }

    // when sorting again the same column
    switch (currentSort.sortType) {
      case DatatableSortType.None:
        this.sort$.next({
          sortBy: sortBy,
          sortType: DatatableSortType.Ascending,
        });
        break;
      case DatatableSortType.Ascending:
        this.sort$.next({
          sortBy: sortBy,
          sortType: DatatableSortType.Descending,
        });
        break;
      case DatatableSortType.Descending:
        this.sort$.next({
          sortBy: sortBy,
          sortType: DatatableSortType.None,
        });
        break;
    }
  }
}
