import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
  Optional,
  Inject,
  forwardRef,
} from '@angular/core';

import { IDatatableSortEvent, DatatableSortType } from './md-datatable.interfaces';
import { MdDataTableHeaderComponent } from './md-datatable-header.component';

@Component({
  selector: 'ng2-md-datatable-column',
  template: '<span><ng-content></ng-content></span>',
  styleUrls: ['md-datatable-column.component.css'],
})
export class MdDataTableColumnComponent {
  @Input() sortableValue: string;
  @Input('numeric') isNumeric: boolean;
  @Output() sortBy: EventEmitter<string> = new EventEmitter<string>();

  @HostBinding('class.sortable')
  get sortable(): boolean {
    return !!this.sortableValue;
  }

  @HostBinding('class.sorted-ascending')
  get ascendingSort() {
    if (!this.sortable) {
      return false;
    }

    const currentSort: IDatatableSortEvent = this.header.sort$.getValue();

    return currentSort && currentSort.sortBy === this.sortableValue &&
      currentSort.sortType === DatatableSortType.Ascending;
  }

  @HostBinding('class.numeric')
  get hasNumericClass() {
    return this.isNumeric;
  }

  @HostBinding('class.sorted-descending')
  get descendingSort() {
    if (!this.sortable) {
      return false;
    }

    const currentSort: IDatatableSortEvent = this.header.sort$.getValue();

    return currentSort && currentSort.sortBy === this.sortableValue &&
      currentSort.sortType === DatatableSortType.Descending;
  }

  constructor(
    @Optional() @Inject(forwardRef(() => MdDataTableHeaderComponent)) private header: MdDataTableHeaderComponent,
  ) { }

  ngOnInit() {
    this.isNumeric = (!!this.isNumeric || (this.isNumeric as any) === '');
  }

  @HostListener('click')
  onClick() {
    if (this.sortable) {
      this.sortBy.emit(this.sortableValue);
    }
  }
}
