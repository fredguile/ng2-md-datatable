import { Injectable } from '@angular/core';

import { TargetedAction } from './md-datatable.interfaces';

@Injectable()
export class MdDatatableActions {
  static UPDATE_SELECTABLE_VALUES = '[Datatable] Update Selectable Values';
  static TOGGLE_SELECT_ALL = '[Datatable] Toggle Select All';
  static TOGGLE_SELECT_ONE = '[Datatable] Toggle Select One';
  static TOGGLE_SORT_COLUMN = '[Datatable] Toggle Sort Column';

  updateSelectableValues(datatableId: string, selectableValues: string[]): TargetedAction {
    return {
      datatableId,
      type: MdDatatableActions.UPDATE_SELECTABLE_VALUES,
      payload: selectableValues,
    };
  }

  toggleSelectAll(datatableId: string, checked: boolean): TargetedAction {
    return {
      datatableId,
      type: MdDatatableActions.TOGGLE_SELECT_ALL,
      payload: checked,
    };
  }

  toggleSelectOne(datatableId: string, selectableValue: string, checked: boolean): TargetedAction {
    return {
      datatableId,
      type: MdDatatableActions.TOGGLE_SELECT_ONE,
      payload: {
        selectableValue,
        checked,
      },
    };
  }

  toggleSortColumn(datatableId: string, sortBy: string): TargetedAction {
    return {
      datatableId,
      type: MdDatatableActions.TOGGLE_SORT_COLUMN,
      payload: sortBy,
    };
  }
}
