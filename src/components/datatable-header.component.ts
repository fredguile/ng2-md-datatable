import {
  AfterViewInit,
  Component,
  forwardRef,
  Inject,
  Optional
} from "@angular/core";

import { MatCheckboxChange } from "@angular/material/checkbox";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { takeUntil } from "rxjs/operators";

import { BaseComponent } from "../common/helpers";
import { Actions } from "../store/actions";
import { areAllRowsSelected } from "../store/reducer";
import { Store } from "../store/store";
import { MatDataTableComponent } from "./datatable.component";

@Component({
  selector: "ng2-md-datatable-header",
  templateUrl: "./datatable-header.component.html",
  styleUrls: ["datatable-header.component.scss"]
})
export class MatDataTableHeaderComponent extends BaseComponent
  implements AfterViewInit {
  allChecked$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  get selectable(): boolean {
    return this.table && this.table.isSelectable;
  }

  private datatableId: string;

  constructor(
    @Optional()
    @Inject(forwardRef(() => MatDataTableComponent))
    private table: MatDataTableComponent,
    private store: Store,
    private actions: Actions
  ) {
    super();
  }

  ngAfterViewInit() {
    this.datatableId = this.table!.id;

    this.store
      .pipe(areAllRowsSelected(this.datatableId), takeUntil(this.unmount$))
      .subscribe(this.allChecked$);
  }

  onAllCheckedChange(e: MatCheckboxChange) {
    this.store.dispatch(
      this.actions.toggleSelectAll(this.datatableId, e.checked)
    );
  }
}
