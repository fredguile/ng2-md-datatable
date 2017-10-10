import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from "@angular/core";

import shuffle from "lodash-es/shuffle";
import "rxjs/add/observable/from";
import "rxjs/add/operator/takeUntil";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

import {
  DatatableSortType,
  IDatatablePaginationEvent,
  IDatatableSelectionEvent,
  IDatatableSortEvent,
  MatDataTableComponent,
  MatDataTablePaginationComponent
} from "ng2-md-datatable";

import { IPagination, ITShirt } from "./app.interfaces";
import { AppService } from "./app.service";

@Component({
  selector: "app-demo-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements AfterViewInit, OnDestroy {
  title = "Demo App: T-Shirts";

  tshirts$: BehaviorSubject<ITShirt[]> = new BehaviorSubject([]);
  currentSelection$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  currentSortBy: string | undefined;
  currentSortType = DatatableSortType.None;
  currentPagination = {
    currentPage: 1,
    itemsPerPage: 8,
    totalCount: 0
  } as IPagination;

  @ViewChild(MatDataTableComponent) datatable: MatDataTableComponent;
  @ViewChild(MatDataTablePaginationComponent)
  pagination: MatDataTablePaginationComponent;

  private unmount$: Subject<void> = new Subject<void>();

  constructor(
    private appService: AppService,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.fetchDemoDataSource();
  }

  ngAfterViewInit() {
    if (this.datatable) {
      Observable.from(this.datatable.selectionChange)
        .takeUntil(this.unmount$)
        .subscribe((e: IDatatableSelectionEvent) =>
          this.currentSelection$.next(e.selectedValues)
        );

      Observable.from(this.datatable.sortChange)
        .takeUntil(this.unmount$)
        .subscribe((e: IDatatableSortEvent) =>
          this.fetchDemoDataSource(
            this.currentPagination.currentPage,
            this.currentPagination.itemsPerPage,
            e.sortBy,
            e.sortType
          )
        );

      Observable.from(this.pagination.paginationChange)
        .takeUntil(this.unmount$)
        .subscribe((e: IDatatablePaginationEvent) =>
          this.fetchDemoDataSource(e.page, e.itemsPerPage)
        );
    }
  }

  ngOnDestroy() {
    this.unmount$.next();
    this.unmount$.complete();
  }

  shuffleData() {
    this.tshirts$.next(shuffle(this.tshirts$.getValue()));
    this.currentSelection$.next([]);
    this.changeDetectorRef.detectChanges();
  }

  private fetchDemoDataSource(
    page: number = this.currentPagination.currentPage,
    limit: number = this.currentPagination.itemsPerPage,
    sortBy: string | undefined = this.currentSortBy,
    sortType: DatatableSortType = this.currentSortType
  ) {
    if (sortBy) {
      this.currentSortBy = sortBy;
      this.currentSortType = sortType;
    }

    const { tshirts, pagination } = this.appService.getDemoDatasource(
      page,
      limit,
      sortBy,
      sortType
    );

    this.tshirts$.next(tshirts);
    this.currentSelection$.next([]);
    this.currentPagination = pagination;
  }
}
