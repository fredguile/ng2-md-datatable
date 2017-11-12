import {
  AfterContentInit,
  Component,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  Optional
} from "@angular/core";

import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { takeUntil } from "rxjs/operators";

import { DatatableSortType } from "../common/enums";
import { DatatableSortEvent } from "../common/events/sort";
import { BaseComponent } from "../common/helpers";
import { Actions } from "../store/actions";
import { getCurrentSort } from "../store/reducer";
import { Store } from "../store/store";
import { MatDataTableComponent } from "./datatable.component";

@Component({
  selector: "ng2-md-datatable-column",
  template: "<span><ng-content></ng-content></span>",
  styleUrls: ["datatable-column.component.scss"]
})
export class MatDataTableColumnComponent extends BaseComponent
  implements AfterContentInit {
  isNumeric = false;
  @Input() sortableValue: string;

  @Input()
  set numeric(val: any) {
    this.isNumeric = val !== "false";
  }

  private datatableId: string;
  private sort$: BehaviorSubject<DatatableSortEvent> = new BehaviorSubject({
    sortType: DatatableSortType.None
  } as DatatableSortEvent);

  @HostBinding("class.sortable")
  get sortable(): boolean {
    return !!this.sortableValue;
  }

  @HostBinding("class.numeric")
  get hasNumericClass() {
    return this.isNumeric;
  }

  @HostBinding("class.sorted-ascending")
  get ascendingSort() {
    if (!this.sortable) {
      return false;
    }

    const currentSort = this.sort$.getValue();

    return (
      currentSort.sortBy === this.sortableValue &&
      currentSort.sortType === DatatableSortType.Ascending
    );
  }

  @HostBinding("class.sorted-descending")
  get descendingSort() {
    if (!this.sortable) {
      return false;
    }

    const currentSort = this.sort$.getValue();

    return (
      currentSort.sortBy === this.sortableValue &&
      currentSort.sortType === DatatableSortType.Descending
    );
  }

  constructor(
    @Optional()
    @Inject(forwardRef(() => MatDataTableComponent))
    private table: MatDataTableComponent,
    private store: Store,
    private actions: Actions
  ) {
    super();
  }

  ngAfterContentInit() {
    this.datatableId = this.table!.id;

    if (this.datatableId) {
      this.store
        .pipe(getCurrentSort(this.datatableId), takeUntil(this.unmount$))
        .subscribe(this.sort$);
    }
  }

  @HostListener("click")
  onClick() {
    if (this.datatableId && this.sortable) {
      this.store.dispatch(
        this.actions.toggleSortColumn(this.datatableId, this.sortableValue)
      );
    }
  }
}
