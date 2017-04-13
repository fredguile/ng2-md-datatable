export type TShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export interface PaginableTshirts {
  tshirts: TShirt[];
  pagination: Pagination;
}

export interface TShirt {
  id: number;
  name: string;
  design?: string;
  size: TShirtSize;
}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalCount: number;
}
