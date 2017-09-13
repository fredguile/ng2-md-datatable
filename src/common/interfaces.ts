import { DatatableSortType } from "./enums";

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

// internal lib state (Redux inspired interfaces)
export namespace LibState {
  export interface IState {
    allRowsSelected: boolean;
    selectableValues: string[];
    selectedValues: string[];
    sortBy?: string;
    sortType: DatatableSortType;
  }

  export interface IStates {
    [datatableId: string]: IState;
  }

  export interface IAction {
    datatableId: string;
    type: string;
    payload?: any;
  }

  export interface IReducer {
    reduce: (state: IStates, action: IAction) => IStates;
  }
}

export namespace ReduxDevTools {
  export interface IConnection {
    init: (state: any) => void;
    send: (action: any, state: any, options?: any, instanceId?: string) => void;
  }

  export interface IExtension {
    connect: (options: any) => IConnection;
  }
}
