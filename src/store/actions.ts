import { Injectable } from "@angular/core";

import { LibState } from "../common/interfaces";

@Injectable()
export class Actions {
  static UPDATE_SELECTABLE_VALUES = "[Datatable] Update Selectable Values";
  static TOGGLE_SELECT_ALL = "[Datatable] Toggle Select All";
  static TOGGLE_SELECT_ONE = "[Datatable] Toggle Select One";
  static TOGGLE_SORT_COLUMN = "[Datatable] Toggle Sort Column";

  updateSelectableValues(
    datatableId: string,
    selectableValues: string[]
  ): LibState.IAction {
    return {
      datatableId,
      type: Actions.UPDATE_SELECTABLE_VALUES,
      payload: selectableValues
    };
  }

  toggleSelectAll(datatableId: string, checked: boolean): LibState.IAction {
    return {
      datatableId,
      type: Actions.TOGGLE_SELECT_ALL,
      payload: checked
    };
  }

  toggleSelectOne(
    datatableId: string,
    selectableValue: string,
    checked: boolean
  ): LibState.IAction {
    return {
      datatableId,
      type: Actions.TOGGLE_SELECT_ONE,
      payload: {
        selectableValue,
        checked
      }
    };
  }

  toggleSortColumn(datatableId: string, sortBy: string): LibState.IAction {
    return {
      datatableId,
      type: Actions.TOGGLE_SORT_COLUMN,
      payload: sortBy
    };
  }
}
