import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  QueryList
} from "@angular/core";

import { from } from "rxjs/observable/from";
import { distinctUntilChanged, map, skip, takeUntil } from "rxjs/operators";

import { DatatableSelectionEvent } from "../common/events/selection";
import { DatatableSortEvent } from "../common/events/sort";
import { BaseComponent } from "../common/helpers";
import { Actions } from "../store/actions";
import { getCurrentSelection, getCurrentSort } from "../store/reducer";
import { Store } from "../store/store";
import { MatDataTableHeaderComponent } from "./datatable-header.component";
import { MatDataTableRowComponent } from "./datatable-row.component";

let instanceId = 0;

@Component({
  selector: "ng2-md-datatable",
  template: "<table><ng-content></ng-content></table>",
  styleUrls: ["datatable.component.scss"]
})
export class MatDataTableComponent extends BaseComponent
  implements AfterContentInit {
  isSelectable = false;

  @Input()
  set selectable(val: any) {
    if (typeof val === "boolean") {
      this.isSelectable = val;
    } else if (typeof val === "string" && val.length > 0) {
      try {
        this.isSelectable = JSON.parse(val);
      } catch (e) {
        console.error(e);
      }
    }
  }

  @Output()
  selectionChange: EventEmitter<DatatableSelectionEvent> = new EventEmitter<
    DatatableSelectionEvent
  >(false);

  @Output()
  sortChange: EventEmitter<DatatableSortEvent> = new EventEmitter<
    DatatableSortEvent
  >(false);

  @ContentChild(forwardRef(() => MatDataTableHeaderComponent))
  headerCmp: MatDataTableHeaderComponent | undefined;
  @ContentChildren(MatDataTableRowComponent)
  rowsCmp: QueryList<MatDataTableRowComponent> | undefined;

  id = `md-datatable-${instanceId++}`;

  constructor(private store: Store, private actions: Actions) {
    super();
  }

  ngAfterContentInit() {
    if (this.isSelectable && this.headerCmp && this.rowsCmp) {
      // when datatable is selectable, update state with selectable values from content
      this.store.dispatch(
        this.actions.updateSelectableValues(
          this.id,
          this.rowsCmp
            .toArray()
            .map((row: MatDataTableRowComponent) => row.selectableValue)
        )
      );

      // subscribe to selection changes and emit DatatableSelectionEvent
      this.store
        .pipe(getCurrentSelection(this.id), skip(1), takeUntil(this.unmount$))
        .subscribe(this.selectionChange);

      // update state with selectable values upon changes
      from(this.rowsCmp.changes)
        .pipe(
          map(query =>
            query
              .toArray()
              .map((row: MatDataTableRowComponent) => row.selectableValue)
          ),
          distinctUntilChanged(
            (values1, values2) =>
              values1.length === values2.length &&
              JSON.stringify(values1) === JSON.stringify(values2)
          ),
          takeUntil(this.unmount$)
        )
        .subscribe(selectableValues =>
          this.store.dispatch(
            this.actions.updateSelectableValues(this.id, selectableValues)
          )
        );
    }

    // subscribe to sort changes and emit DatatableSortEvent
    this.store
      .pipe(getCurrentSort(this.id), takeUntil(this.unmount$))
      .subscribe(this.sortChange);
  }
}
