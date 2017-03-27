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

import { MdSelect, MdSelectChange } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { IDatatablePaginationEvent } from './md-datatable.interfaces';

@Component({
  selector: 'ng2-md-datatable-pagination',
  template: `
    <span>Rows per page:</span>
    <md-select [(ngModel)]="itemsPerPage" class="pagination__itemsPerPage">
      <md-option *ngFor="let choice of itemsPerPageChoices"
        value="{{ choice }}">{{ choice }}</md-option>
    </md-select>
    <span class="pagination__range">{{firstIndexOfPage}}-{{lastIndexOfPage}} of {{itemsCount}}</span>
    <div class="pagination__controls">
      <button md-icon-button
        (click)="onClickFirst()"
        aria-label="First">
        <md-icon>first_page</md-icon>
      </button>
      <button md-icon-button
        [disabled]="isPreviousButtonEnabled"
        (click)="onClickPrevious()"
        aria-label="Previous">
        <md-icon>navigate_before</md-icon>
      </button>
      <button md-icon-button
        [disabled]="isNextOrLastButtonEnabled"
        (click)="onClickNext()"
        aria-label="Next">
        <md-icon>navigate_next</md-icon>
      </button>
      <button md-icon-button
        [disabled]="isNextOrLastButtonEnabled"
        (click)="onClickLast()"
        aria-label="Last">
        <md-icon>last_page</md-icon>
      </button>
    </div>
  `,
  styleUrls: ['md-datatable-pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdDataTablePaginationComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() currentPage: number;
  @Input() itemsPerPage: number;
  @Input() itemsCount: number;
  @Input() itemsPerPageChoices: Array<number> = [5, 10, 20, 50];
  @Input() itemsPerPageFirstChoice = 10;
  @Output() paginationChange: EventEmitter<IDatatablePaginationEvent>;
  @ViewChild(MdSelect) toggleGroup: MdSelect;

  get firstIndexOfPage() {
    return this.currentPage * this.itemsPerPage - this.itemsPerPage + 1;
  }

  get lastIndexOfPage() {
    return this.currentPage * this.itemsPerPage;
  }

  get isPreviousButtonEnabled() {
    return this.firstIndexOfPage === 1;
  }

  get isNextOrLastButtonEnabled() {
    return this.lastIndexOfPage >= this.itemsCount;
  }

  private subscription: Subscription;

  constructor() {
    this.paginationChange = new EventEmitter<IDatatablePaginationEvent>(true); // async
  }

  ngOnInit() {
    // set defaults values if not provided
    if (!this.currentPage) {
      this.currentPage = 1;
    }

    if (!this.itemsPerPage) {
      this.itemsPerPage = this.itemsPerPageFirstChoice;
    }

    if (!this.itemsCount) {
      this.itemsCount = 0;
    }
  }

  ngAfterViewInit() {
    // propagate click on pagination control
    this.subscription = this.toggleGroup.change
      .subscribe((change: MdSelectChange) => this.paginationChange.emit({
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
