import { IDatatablePaginationEvent } from "../interfaces";

export class DatatablePaginationEvent implements IDatatablePaginationEvent {
  private _page: number;
  private _itemsPerPage: number;

  constructor(page: number, itemPerPage: number) {
    this._page = page;
    this._itemsPerPage = itemPerPage;
  }

  get page(): number {
    return this._page;
  }

  get itemsPerPage(): number {
    return this._itemsPerPage;
  }
}
