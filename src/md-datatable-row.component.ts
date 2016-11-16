import { Component, OnInit, Input, Output, HostBinding, HostListener } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IDatatableCheckEvent } from './md-datatable.interfaces';

@Component({
  selector: 'app-md-datatable-row',
  template: `
    <td *ngIf="selectable" class="md-data-check-cell">
      <md-checkbox [checked]="isChecked"></md-checkbox>
    </td>
    <ng-content></ng-content>
  `,
  styleUrls: ['md-datatable-row.component.css']
})
export class MdDataTableRowComponent implements OnInit {
  @Input() selectableValue: string;
  @Output() check$: BehaviorSubject<IDatatableCheckEvent>;

  @HostBinding('class.selectable')
  get selectable(): boolean {
    return !!this.selectableValue;
  }

  @HostBinding('class.checked')
  get isChecked(): boolean {
    return this.check$.getValue().isChecked;
  }

  ngOnInit() {
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
}
