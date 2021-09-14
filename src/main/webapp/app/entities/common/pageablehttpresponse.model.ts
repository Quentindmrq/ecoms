import { IScrollRegisterConfig } from 'ngx-infinite-scroll/src/models';

export interface ISort {
  unsorted: boolean;
  sorted: boolean;
  empty: boolean;
}

export interface IPeagable {
  sort: IScrollRegisterConfig;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface PageableResponse<T> {
  content: T[];
  pageable?: IPeagable;
  totalPages?: number;
  totalElements?: number;
  last?: boolean;
  number?: number;
  sort?: ISort;
  size?: number;
  first?: boolean;
  numberOfElements?: number;
  empty?: boolean;
}
