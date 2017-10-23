import { IDatatableSelectionEvent } from "../interfaces";

export class DatatableSelectionEvent implements IDatatableSelectionEvent {
  private _allRowsSelected: boolean;
  private _selectedValues: string[];

  constructor(allRowsSelected: boolean, selectedValues: string[]) {
    this._allRowsSelected = allRowsSelected;
    this._selectedValues = selectedValues;
  }

  get allRowsSelected(): boolean {
    return this._allRowsSelected;
  }

  get selectedValues(): string[] {
    return this._selectedValues;
  }
}
