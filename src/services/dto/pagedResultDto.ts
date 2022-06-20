export interface PagedResultDto<T> {
  totalCount: number;
  items: T[];
}
export interface PagedResultUserDto<T> {
  items: T[];
}


export interface NewPagedResultDto<T> {
  totalElement: number;
  data: T[];
  status: boolean,
  pageIndex: number,
  pageSize: number
}

export interface NewResponseResultArray<T>{
  status: boolean, message: string, data: T[];
}

export interface NewResponseResultObject<T>{
  status: boolean, message: string, data: T;
}
