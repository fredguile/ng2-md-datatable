import { DatatableSortType } from "../enums";
import { IDatatableSortEvent } from "../interfaces";

export class DatatableSortEvent implements IDatatableSortEvent {
  private _sortBy: string | undefined;
  private _sortType: DatatableSortType;

  constructor(sortBy: string | undefined, sortType: DatatableSortType) {
    this._sortBy = sortBy;
    this._sortType = sortType;
  }

  get sortBy(): string | undefined {
    return this._sortBy;
  }

  get sortType(): DatatableSortType {
    return this._sortType;
  }
}
