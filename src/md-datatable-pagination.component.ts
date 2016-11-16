import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';

import { MdButtonToggleGroup, MdButtonToggleChange } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { IDatatablePaginationEvent } from './md-datatable.interfaces';

@Component({
  selector: 'app-md-datatable-pagination',
  template: `
    <span class="pagination__range">{{firstIndexOfPage}}-{{lastIndexOfPage}} of {{itemsCount}}</span>
    <div class="pagination__controls">
      <button md-button
        (click)="onClickFirst()"
        aria-label="First">First</button>
      <button md-button
        [disabled]="isPreviousButtonEnabled"
        (click)="onClickPrevious()"
        aria-label="Previous">Previous</button>
      <button md-button
        [disabled]="isNextButtonEnabled"
        (click)="onClickNext()"
        aria-label="Next">Next</button>
      <button md-button
        (click)="onClickLast()"
        aria-label="Last">Last</button>
    </div>
    <md-button-toggle-group [value]="itemsPerPage" class="pagination__itemsPerPage">
      <md-button-toggle value="5">5</md-button-toggle>
      <md-button-toggle value="10">10</md-button-toggle>
      <md-button-toggle value="20">20</md-button-toggle>
      <md-button-toggle value="50">50</md-button-toggle>
    </md-button-toggle-group>
  `,
  styleUrls: ['md-datatable-pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdDataTablePaginationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() currentPage: number;
  @Input() itemsPerPage: number;
  @Input() itemsCount: number;
  @Output() paginationChange: EventEmitter<IDatatablePaginationEvent>;

  get firstIndexOfPage() {
    return this.currentPage * this.itemsPerPage - this.itemsPerPage + 1;
  }

  get lastIndexOfPage() {
    return this.currentPage * this.itemsPerPage;
  }

  get isPreviousButtonEnabled() {
    return this.firstIndexOfPage === 1;
  }

  get isNextButtonEnabled() {
    return this.lastIndexOfPage >= this.itemsCount;
  }

  @ViewChild(MdButtonToggleGroup) private toggleGroup: MdButtonToggleGroup;
  private subscription: Subscription;

  ngOnInit() {
    // set defaults values if not provided
    if (!this.currentPage) {
      this.currentPage = 1;
    }

    if (!this.itemsPerPage) {
      this.itemsPerPage = 5;
    }

    if (!this.itemsCount) {
      this.itemsCount = 0;
    }

    this.paginationChange = new EventEmitter<IDatatablePaginationEvent>(true); // async
  }

  ngAfterViewInit() {
    // propagate click on pagination control
    this.subscription = this.toggleGroup.change
      .skip(1) // skip initial change happening during AfterViewInit
      .distinctUntilKeyChanged('value')
      .subscribe((change: MdButtonToggleChange) => this.paginationChange.emit({
        page: 1,
        itemsPerPage: Number(change.value),
      }));
  }

  onClickFirst() {
    this.paginationChange.emit({ page: 1, itemsPerPage: this.itemsPerPage });
  }

  onClickPrevious() {
    this.paginationChange.emit({ page: this.currentPage - 1, itemsPerPage: this.itemsPerPage });
  }

  onClickNext() {
    this.paginationChange.emit({ page: this.currentPage + 1, itemsPerPage: this.itemsPerPage });
  }

  onClickLast() {
    const lastPage = Math.round(this.itemsCount / this.itemsPerPage);
    this.paginationChange.emit({ page: lastPage, itemsPerPage: this.itemsPerPage });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
