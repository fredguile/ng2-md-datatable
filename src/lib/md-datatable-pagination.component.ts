import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

import { MdSelectChange } from '@angular/material';

import { BaseComponent } from './helpers';
import { IDatatablePaginationEvent } from './md-datatable.interfaces';

@Component({
  selector: 'ng2-md-datatable-pagination',
  template: `
    <span>Rows per page:</span>
    <md-select [ngModel]="itemsPerPage" (change)="onSelectChange($event)" class="pagination__itemsPerPage">
      <md-option *ngFor="let choice of itemsPerPageChoices"
        [value]="choice">{{ choice }}</md-option>
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
  styleUrls: ['md-datatable-pagination.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdDataTablePaginationComponent extends BaseComponent implements OnInit {
  @Input() currentPage: number;
  @Input() itemsPerPage: number;
  @Input() itemsCount: number;
  @Input() itemsPerPageChoices: Array<number> = [5, 10, 20, 50];
  @Input() itemsPerPageFirstChoice = 10;

  @Output() paginationChange: EventEmitter<IDatatablePaginationEvent>;

  get firstIndexOfPage() {
    return this.currentPage * this.itemsPerPage - this.itemsPerPage + 1;
  }

  get lastIndexOfPage() {
      let maxLastIndexOnPage = this.currentPage * this.itemsPerPage;
      return maxLastIndexOnPage >= this.itemsCount ? this.itemsCount : maxLastIndexOnPage;
  }

  get isPreviousButtonEnabled() {
    return this.firstIndexOfPage === 1;
  }

  get isNextOrLastButtonEnabled() {
    return this.lastIndexOfPage >= this.itemsCount;
  }

  constructor() {
    super();
    this.paginationChange = new EventEmitter<IDatatablePaginationEvent>(true);
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

  onSelectChange(event: MdSelectChange) {
    this.paginationChange.emit(<IDatatablePaginationEvent>{
      page: 1,
      itemsPerPage: Number(event.value),
    });
  }

  onClickFirst() {
    this.paginationChange.emit(<IDatatablePaginationEvent>{
      page: 1,
      itemsPerPage: this.itemsPerPage,
    });
  }

  onClickLast() {
    const lastPage = Math.round(this.itemsCount / this.itemsPerPage);

    this.paginationChange.emit(<IDatatablePaginationEvent>{
      page: lastPage,
      itemsPerPage: this.itemsPerPage,
    });
  }

  onClickPrevious() {
    this.paginationChange.emit(<IDatatablePaginationEvent>{
      page: this.currentPage - 1,
      itemsPerPage: this.itemsPerPage,
    });
  }

  onClickNext() {
    this.paginationChange.emit(<IDatatablePaginationEvent>{
      page: this.currentPage + 1,
      itemsPerPage: this.itemsPerPage,
    });
  }
}
