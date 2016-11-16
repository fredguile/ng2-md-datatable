export interface IDatatableCheckEvent {
  isChecked: boolean;
  value: string;
  propagate: boolean;
}

export interface IDatatableSelectionEvent {
  allRowsSelected: boolean;
  selectedValues: string[];
}

export interface IDatatableSortEvent {
  sortBy: string;
  sortType: DatatableSortType;
}

export interface IDatatablePaginationEvent {
  page: number;
  itemsPerPage: number;
}

export enum DatatableSortType {
  None,
  Ascending,
  Descending
}
