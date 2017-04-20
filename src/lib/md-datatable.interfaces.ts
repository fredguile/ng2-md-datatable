// Redux inspired interfaces
export interface IDatatableAction {
  datatableId: string;
  type: string;
  payload?: any;
}

export enum DatatableSortType {
  None,
  Ascending,
  Descending
}

export interface IDatatableState {
  allRowsSelected: boolean;
  selectableValues: string[];
  selectedValues: string[];
  sortBy?: string;
  sortType?: DatatableSortType;
}

export interface IDatatablesState {
  [datatableId: string]: IDatatableState;
}

// public events
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
