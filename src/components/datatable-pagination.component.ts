import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from "@angular/core";

import { MatSelectChange } from "@angular/material";

import { DatatablePaginationEvent } from "../common/events/pagination";
import { BaseComponent } from "../common/helpers";

@Component({
  selector: "ng2-md-datatable-pagination",
  templateUrl: "./datatable-pagination.component.html",
  styleUrls: ["datatable-pagination.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatDataTablePaginationComponent extends BaseComponent
  implements OnInit {
  @Input() currentPage: number;
  @Input() itemsPerPage: number;
  @Input() itemsCount: number;
  @Input() itemsPerPageChoices: number[] = [5, 10, 20, 50];
  @Input() itemsPerPageFirstChoice = 10;
  @Input() needShowFirstArrow = true;
  @Input() needShowLastArrow = true;
  @Input() ofText = "of";
  @Input() rowsPerPageText = "Rows per page:";

  @Output()
  paginationChange: EventEmitter<DatatablePaginationEvent> = new EventEmitter<
    DatatablePaginationEvent
  >(true);

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    super();
  }

  get firstIndexOfPage() {
    return this.currentPage * this.itemsPerPage - this.itemsPerPage + 1;
  }

  get lastIndexOfPage() {
    const maxLastIndexOnPage = this.currentPage * this.itemsPerPage;
    return maxLastIndexOnPage >= this.itemsCount
      ? this.itemsCount
      : maxLastIndexOnPage;
  }

  get isPreviousOrFirstButtonDisabled() {
    return this.currentPage === 1;
  }

  get isNextOrLastButtonDisabled() {
    return this.lastIndexOfPage >= this.itemsCount;
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

  onSelectChange(event: MatSelectChange) {
    this.currentPage = 1;
    this.itemsPerPage = Number(event.value);
    this.changeDetectorRef.markForCheck();
    this.emitPaginationChange();
  }

  onClickFirst() {
    this.currentPage = 1;
    this.changeDetectorRef.markForCheck();
    this.emitPaginationChange();
  }

  onClickLast() {
    this.currentPage = Math.ceil(this.itemsCount / this.itemsPerPage);
    this.changeDetectorRef.markForCheck();
    this.emitPaginationChange();
  }

  onClickPrevious() {
    this.currentPage = this.currentPage - 1;
    this.changeDetectorRef.markForCheck();
    this.emitPaginationChange();
  }

  onClickNext() {
    this.currentPage = this.currentPage + 1;
    this.changeDetectorRef.markForCheck();
    this.emitPaginationChange();
  }

  private emitPaginationChange() {
    this.paginationChange.emit(
      new DatatablePaginationEvent(this.currentPage, this.itemsPerPage)
    );
  }
}
