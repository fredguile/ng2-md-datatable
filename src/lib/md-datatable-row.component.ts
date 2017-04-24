import {
  Component,
  AfterViewInit,
  Input,
  HostBinding,
  HostListener,
  ViewChild,
  Inject,
  Optional,
  forwardRef,
} from '@angular/core';

import { MdCheckbox, MdCheckboxChange } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { async } from 'rxjs/scheduler/async';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/takeUntil';

import { BaseComponent } from './helpers';
import { MdDataTableComponent } from './md-datatable.component';
import { MdDatatableStore } from './md-datatable.store';
import { isRowSelected } from './md-datatable.reducer';
import { MdDatatableActions } from './md-datatable.actions';

@Component({
  selector: 'ng2-md-datatable-row',
  template: `
    <td *ngIf="selectable" class="md-data-check-cell">
      <md-checkbox [checked]="checked$ | async" (change)="onCheckboxChange($event)"></md-checkbox>
    </td>
    <ng-content></ng-content>
  `,
  styleUrls: ['md-datatable-row.component.scss'],
})
export class MdDataTableRowComponent extends BaseComponent implements AfterViewInit {
  @Input() selectableValue: string;
  checked$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @ViewChild(MdCheckbox) checkboxCmp: MdCheckbox;

  private datatableId: string;

  @HostBinding('class.selectable')
  get selectable(): boolean {
    return !!this.selectableValue && this.table && this.table.isSelectable;
  }

  @HostBinding('class.checked')
  get isChecked(): boolean {
    return this.checked$.getValue();
  }

  @HostListener('click', ['$event'])
  onRowClick(event: MouseEvent) {
    // react only on selectable rows
    if (!this.selectable) {
      return;
    }

    // propagate clicks on the whole row (except on links) to MdCheckbox
    if (this.selectable && this.checkboxCmp && (<any>(event.target))['nodeName'] !== 'A') {
      event.preventDefault();
      this.checkboxCmp.toggle();
      this.store.dispatch(
        this.actions.toggleSelectOne(this.datatableId, this.selectableValue, this.checkboxCmp.checked)
      );
    }
  }

  constructor(
    @Optional() @Inject(forwardRef(() => MdDataTableComponent)) private table: MdDataTableComponent,
    private store: MdDatatableStore,
    private actions: MdDatatableActions,
  ) {
    super();
  }

  ngAfterViewInit() {
    this.datatableId = this.table!.id;

    this.store
      .let(isRowSelected(this.datatableId, this.selectableValue))
      .takeUntil(this.unmount$)
      .subscribe(this.checked$);
  }

  onCheckboxChange(event: MdCheckboxChange) {
    this.store.dispatch(
      this.actions.toggleSelectOne(this.datatableId, this.selectableValue, event.checked)
    );
  }
}
