import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { distinctUntilChanged, filter, map, pluck } from "rxjs/operators";

import { DatatableSortType } from "../common/enums";
import { Actions } from "../store/actions";

import { DatatableSelectionEvent } from "../common/events/selection";
import { DatatableSortEvent } from "../common/events/sort";
import { LibState } from "../common/interfaces";

function initialState(selectableValues: string[] = []): LibState.IState {
  return {
    allRowsSelected: false,
    selectableValues,
    selectedValues: [],
    sortType: DatatableSortType.None
  } as LibState.IState;
}

@Injectable()
export class Reducer implements LibState.IReducer {
  reduce(states: LibState.IStates, action: LibState.IAction): LibState.IStates {
    const { datatableId } = action;
    const state: LibState.IState =
      (states && states[datatableId]) || initialState();

    const {
      allRowsSelected,
      selectableValues,
      selectedValues,
      sortBy,
      sortType
    } = state;

    switch (action.type) {
      case Actions.UPDATE_SELECTABLE_VALUES:
        return Object.assign({}, states, {
          [datatableId]: {
            allRowsSelected:
              action.payload.length > 0 ? allRowsSelected : false,
            selectableValues: action.payload,
            selectedValues:
              action.payload.length > 0 && allRowsSelected
                ? action.payload
                : [],
            sortBy,
            sortType
          } as LibState.IState
        });

      case Actions.TOGGLE_SELECT_ALL:
        return Object.assign({}, states, {
          [datatableId]: {
            allRowsSelected: action.payload,
            selectableValues,
            selectedValues: action.payload
              ? selectableValues.slice(0).sort()
              : [],
            sortBy,
            sortType
          } as LibState.IState
        });

      case Actions.TOGGLE_SELECT_ONE: {
        const { selectableValue, checked } = action.payload;

        return Object.assign({}, states, {
          [datatableId]: {
            allRowsSelected:
              checked && selectedValues.length === selectableValues.length - 1,
            selectableValues,
            selectedValues: checked
              ? [...selectedValues, selectableValue].sort()
              : selectedValues.filter(v => v !== selectableValue),
            sortBy,
            sortType
          } as LibState.IState
        });
      }

      case Actions.TOGGLE_SORT_COLUMN: {
        if (action.payload !== sortBy) {
          return Object.assign({}, states, {
            [datatableId]: {
              allRowsSelected: false,
              selectableValues,
              selectedValues: [],
              sortBy: action.payload,
              sortType: DatatableSortType.Ascending
            } as LibState.IState
          });
        }

        let newSortType;
        switch (sortType) {
          case DatatableSortType.None:
            newSortType = DatatableSortType.Ascending;
            break;
          case DatatableSortType.Ascending:
            newSortType = DatatableSortType.Descending;
            break;
          case DatatableSortType.Descending:
            newSortType = DatatableSortType.None;
            break;
        }

        return Object.assign({}, states, {
          [datatableId]: {
            allRowsSelected: false,
            selectableValues,
            selectedValues: [],
            sortBy,
            sortType: newSortType
          } as LibState.IState
        });
      }

      default:
        return states;
    }
  }
}

export function getDatatableState(
  datatableId: string
): (state$: Observable<LibState.IStates>) => Observable<LibState.IState> {
  return (state$: Observable<LibState.IStates>) =>
    state$.pipe(
      map(datatablesState => datatablesState[datatableId]),
      filter(datatableState => !!datatableState)
    );
}

export function areAllRowsSelected(
  datatableId: string
): (state$: Observable<LibState.IStates>) => Observable<boolean> {
  return (state$: Observable<LibState.IStates>) =>
    getDatatableState(datatableId)(state$).pipe(
      pluck<LibState.IState, boolean>("allRowsSelected"),
      distinctUntilChanged()
    );
}

export function isRowSelected(
  datatableId: string,
  selectableValue: string
): (state$: Observable<LibState.IStates>) => Observable<boolean> {
  return (state$: Observable<LibState.IStates>) =>
    getDatatableState(datatableId)(state$).pipe(
      map(
        datatableState =>
          datatableState.allRowsSelected ||
          datatableState.selectedValues.indexOf(selectableValue) !== -1
      ),
      distinctUntilChanged()
    );
}

export function getCurrentSelection(
  datatableId: string
): (
  state$: Observable<LibState.IStates>
) => Observable<DatatableSelectionEvent> {
  return (state$: Observable<LibState.IStates>) =>
    getDatatableState(datatableId)(state$).pipe(
      map(
        state =>
          new DatatableSelectionEvent(
            state.allRowsSelected,
            state.selectedValues
          )
      ),
      distinctUntilChanged(
        (e1, e2) =>
          e1.allRowsSelected === e2.allRowsSelected &&
          e1.selectedValues.length === e2.selectedValues.length
      )
    );
}

export function getCurrentSort(
  datatableId: string
): (state$: Observable<LibState.IStates>) => Observable<DatatableSortEvent> {
  return (state$: Observable<LibState.IStates>) =>
    getDatatableState(datatableId)(state$).pipe(
      map(state => new DatatableSortEvent(state.sortBy, state.sortType)),
      filter(currentSort => !!currentSort.sortBy),
      distinctUntilChanged(
        (e1, e2) => e1!.sortBy === e2!.sortBy && e1!.sortType === e2!.sortType
      )
    );
}
