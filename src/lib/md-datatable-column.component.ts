import {
  Component,
  AfterViewInit,
  Input,
  HostBinding,
  HostListener,
  Inject,
  Optional,
  forwardRef,
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/takeUntil';

import { BaseComponent } from './helpers';
import { MdDataTableComponent } from './md-datatable.component';
import { MdDataTableHeaderComponent } from './md-datatable-header.component';

import {
  IDatatablesState,
  IDatatableSortEvent,
  DatatableSortType
} from './md-datatable.interfaces';

import { MdDatatableStore } from './md-datatable.store';
import { getCurrentSort } from './md-datatable.reducer';
import { MdDatatableActions } from './md-datatable.actions';

@Component({
  selector: 'ng2-md-datatable-column',
  template: '<span><ng-content></ng-content></span>',
  styleUrls: ['md-datatable-column.component.css'],
})
export class MdDataTableColumnComponent extends BaseComponent implements AfterViewInit {
  isNumeric = false;
  @Input() sortableValue: string;

  @Input()
  set numeric(val: any) {
    this.isNumeric = val !== 'false';
  }

  private datatableId: string;
  private sort$: BehaviorSubject<IDatatableSortEvent> = new BehaviorSubject(<IDatatableSortEvent>{
    sortBy: null,
    sortType: DatatableSortType.None,
  });

  @HostBinding('class.sortable')
  get sortable(): boolean {
    return !!this.sortableValue;
  }

  @HostBinding('class.numeric')
  get hasNumericClass() {
    return this.isNumeric;
  }

  @HostBinding('class.sorted-ascending')
  get ascendingSort() {
    if (!this.sortable) {
      return false;
    }

    const currentSort = this.sort$.getValue();

    return currentSort.sortBy === this.sortableValue &&
      currentSort.sortType === DatatableSortType.Ascending;
  }

  @HostBinding('class.sorted-descending')
  get descendingSort() {
    if (!this.sortable) {
      return false;
    }

    const currentSort = this.sort$.getValue();

    return currentSort.sortBy === this.sortableValue &&
      currentSort.sortType === DatatableSortType.Descending;
  }

  constructor(
    @Optional() @Inject(forwardRef(() => MdDataTableComponent)) private table: MdDataTableComponent,
    private store: MdDatatableStore,
    private actions: MdDatatableActions,
  ) {
    super();
  }

  ngAfterViewInit() {
    this.datatableId = this.table ? this.table.id : undefined;

    if (this.datatableId) {
      this.store
        .let(getCurrentSort(this.datatableId))
        .takeUntil(this.unmount$)
        .subscribe(this.sort$);
    }
  }

  @HostListener('click')
  onClick() {
    if (this.datatableId && this.sortable) {
      this.store.dispatch(this.actions.toggleSortColumn(this.datatableId, this.sortableValue));
    }
  }
}
