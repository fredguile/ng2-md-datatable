export type TShirtSize = "S" | "M" | "L" | "XL" | "XXL";

export interface IPaginableTshirts {
  tshirts: ITShirt[];
  pagination: IPagination;
}

export interface ITShirt {
  id: number;
  name: string;
  design?: string;
  size: TShirtSize;
}

export interface IPagination {
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
}
