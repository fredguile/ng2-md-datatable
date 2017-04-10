import { Action } from '@ngrx/store';

// wrap datatableId in Action to target a specific datatable
export interface TargetedAction extends Action {
  datatableId: string;
}

export interface IDatatablesState {
  [datatableId: string]: IDatatableState;
}

export interface IDatatableState {
  allRowsSelected: boolean;
  selectableValues: string[];
  selectedValues: string[];
  sortBy?: string;
  sortType?: DatatableSortType;
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
