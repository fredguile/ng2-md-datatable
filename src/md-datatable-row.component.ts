import {
  Component,
  Input,
  Output,
  HostBinding,
  HostListener,
  Optional,
  Inject,
  forwardRef,
  ContentChildren,
  QueryList,
  Directive,
} from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MdDataTableComponent } from './md-datatable.component';
import { IDatatableCheckEvent } from './md-datatable.interfaces';

@Directive({ selector: 'td' })
export class MdDataTableCellDirective {
  @HostBinding('class.numeric')
  get isNumeric() {
    return this.row.isCellNumeric(this);
  }

  constructor(
    @Optional() @Inject(forwardRef(() => MdDataTableRowComponent)) private row: MdDataTableRowComponent,
  ) { }
}

@Component({
  selector: 'ng2-md-datatable-row',
  template: `
    <td *ngIf="selectable" class="md-data-check-cell">
      <md-checkbox [checked]="isChecked"></md-checkbox>
    </td>
    <ng-content></ng-content>
  `,
  styleUrls: ['md-datatable-row.component.css'],
})
export class MdDataTableRowComponent {
  @Input() selectableValue: string;
  @Output() check$: BehaviorSubject<IDatatableCheckEvent>;

  @ContentChildren(MdDataTableCellDirective) cells: QueryList<MdDataTableCellDirective>;

  @HostBinding('class.selectable')
  get selectable(): boolean {
    return !!this.selectableValue;
  }

  @HostBinding('class.checked')
  get isChecked(): boolean {
    return this.check$.getValue().isChecked;
  }

  constructor(
    @Optional() @Inject(forwardRef(() => MdDataTableComponent)) private table: MdDataTableComponent,
  ) {
    this.check$ = new BehaviorSubject<IDatatableCheckEvent>({
      isChecked: false,
      value: this.selectableValue,
      propagate: false,
    });
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    // react only on selectable rows
    if (!this.selectable) {
      return;
    }

    // listen for any click except on links
    if (this.selectable && event.target['nodeName'] !== 'A') {
      event.preventDefault();
      this.toggleCheck();
    }
  }

  toggleCheck() {
    this.check$.next({
      isChecked: !this.check$.getValue().isChecked,
      value: this.selectableValue,
      propagate: true,
    });
  }

  setCheck(checked: boolean) {
    this.check$.next({
      isChecked: checked,
      value: this.selectableValue,
      propagate: false,
    });
  }

  isCellNumeric(cell: MdDataTableCellDirective) {
    if (!this.cells) {
      return false;
    }

    let index = -1;

    this.cells.find((cellItem, i) => {
      const match = cellItem === cell;

      if (match) {
        index = i;
      }

      return match;
    });

    if (index === -1) {
      return false;
    }

    return !!this.table.header.columnTypes[index];
  }
}
