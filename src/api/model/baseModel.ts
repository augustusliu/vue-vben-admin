export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T extends any> {
  items: T[];
  total: number;
}

export interface BasicListResult<T extends any> {
  records: T[];
  total: number;
}
