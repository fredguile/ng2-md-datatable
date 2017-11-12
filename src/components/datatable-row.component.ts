import {
  AfterContentInit,
  Component,
  forwardRef,
  HostBinding,
  HostListener,
  Inject,
  Input,
  Optional,
  ViewChild
} from "@angular/core";

import { MatCheckbox, MatCheckboxChange } from "@angular/material";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { takeUntil } from "rxjs/operators";

import { BaseComponent } from "../common/helpers";
import { Actions } from "../store/actions";
import { isRowSelected } from "../store/reducer";
import { Store } from "../store/store";
import { MatDataTableComponent } from "./datatable.component";

@Component({
  selector: "ng2-md-datatable-row",
  template: `
      <td *ngIf="selectable" class="md-data-check-cell">
        <mat-checkbox [checked]="checked$ | async" (change)="onCheckboxChange($event)"></mat-checkbox>
      </td>
      <ng-content></ng-content>
    `,
  styleUrls: ["datatable-row.component.scss"]
})
export class MatDataTableRowComponent extends BaseComponent
  implements AfterContentInit {
  @Input() selectableValue: string;
  checked$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @ViewChild(MatCheckbox) checkboxCmp: MatCheckbox;

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

  @HostBinding("class.selectable")
  get selectable(): boolean {
    return !!this.selectableValue && this.table && this.table.isSelectable;
  }

  @HostBinding("class.checked")
  get isChecked(): boolean {
    return this.checked$.getValue();
  }

  @HostListener("click", ["$event"])
  onRowClick(event: MouseEvent) {
    // react only on selectable rows
    if (!this.selectable) {
      return;
    }

    // propagate clicks on the whole row (except on links) to MatCheckbox
    if (
      this.selectable &&
      this.checkboxCmp &&
      (event.target as any)["nodeName"] !== "A"
    ) {
      event.preventDefault();
      this.store.dispatch(
        this.actions.toggleSelectOne(
          this.datatableId,
          this.selectableValue,
          !this.isChecked
        )
      );
    }
  }

  ngAfterContentInit() {
    this.datatableId = this.table!.id;

    this.store
      .pipe(
        isRowSelected(this.datatableId, this.selectableValue),
        takeUntil(this.unmount$)
      )
      .subscribe(this.checked$);
  }

  onCheckboxChange(event: MatCheckboxChange) {
    this.store.dispatch(
      this.actions.toggleSelectOne(
        this.datatableId,
        this.selectableValue,
        event.checked
      )
    );
  }
}
