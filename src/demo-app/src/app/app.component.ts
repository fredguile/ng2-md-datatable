import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { async } from 'rxjs/scheduler/async';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/takeUntil';
import { shuffle } from 'lodash-es';

import {
  MdDataTableComponent,
  MdDataTablePaginationComponent,
  IDatatableSelectionEvent,
  IDatatableSortEvent,
  IDatatablePaginationEvent,
  DatatableSortType,
 } from '../../../../dist/ng2-md-datatable';

import { TShirt } from './app.interfaces';
import { AppService } from './app.service';

@Component({
  selector: 'ng2-md-demo-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = 'Demo App: T-Shirts';
  tshirts$: Observable<TShirt[]>;

  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
  currentSelection: string[];
  currentSortBy: string;
  currentSortType: DatatableSortType;

  @ViewChild(MdDataTableComponent) datatable: MdDataTableComponent;
  @ViewChild(MdDataTablePaginationComponent) pagination: MdDataTablePaginationComponent;

  private _tshirts$: BehaviorSubject<TShirt[]> = new BehaviorSubject<TShirt[]>([]);
  private unmount$: Subject<void> = new Subject<void>();

  constructor(private appService: AppService) {
    this.tshirts$ = this._tshirts$;
    this.fetchDemoDataSource(1, 10);
  }

  ngAfterViewInit() {
    if (this.datatable) {
      Observable.from(this.datatable.selectionChange)
        .takeUntil(this.unmount$)
        .subscribe((e: IDatatableSelectionEvent) => this.currentSelection = e.selectedValues);

      Observable.from(this.datatable.sortChange)
        .takeUntil(this.unmount$)
        .subscribe((e: IDatatableSortEvent) =>
          this.fetchDemoDataSource(this.currentPage, this.itemsPerPage, e.sortBy, e.sortType));

      Observable.from(this.pagination.paginationChange)
        .takeUntil(this.unmount$)
        .subscribe((e: IDatatablePaginationEvent) =>
          this.fetchDemoDataSource(e.page, e.itemsPerPage));
    }
  }

  ngOnDestroy() {
    this.unmount$.next();
    this.unmount$.complete();
  }

  shuffleData() {
    const currentTshirts: TShirt[] = this._tshirts$.getValue();
    this._tshirts$.next(shuffle(currentTshirts));
  }

  private fetchDemoDataSource(
    page: number = this.currentPage,
    limit: number = this.itemsPerPage,
    sortBy: string = this.currentSortBy,
    sortType: DatatableSortType = this.currentSortType,
  ) {
    if (sortBy) {
      this.currentSortBy = sortBy;
      this.currentSortType = sortType;
    }

    const { tshirts, pagination } = this.appService
      .getDemoDatasource(page, limit, sortBy, sortType);

    this._tshirts$.next(tshirts);
    this.currentPage = pagination.currentPage;
    this.itemsPerPage = pagination.itemsPerPage;
    this.totalCount = pagination.totalCount;
    this.currentSelection = [];
  }
}
