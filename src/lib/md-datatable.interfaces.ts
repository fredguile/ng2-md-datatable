// Redux inspired interfaces

export interface IDatatableAction {
  datatableId: string;
  type: string;
  payload?: any;
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

export interface IDatatableReducer {
  reduce: (state: IDatatablesState, action: IDatatableAction) => IDatatablesState;
}

// public events
export interface IDatatableSelectionEvent {
  allRowsSelected: boolean;
  selectedValues: string[];
}

export interface IDatatableSortEvent {
  sortBy?: string;
  sortType: DatatableSortType;
}

export interface IDatatablePaginationEvent {
  page: number;
  itemsPerPage: number;
}

// public enums
export enum DatatableSortType {
  None,
  Ascending,
  Descending
}
