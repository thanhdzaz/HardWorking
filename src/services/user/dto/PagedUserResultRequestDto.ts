import { PagedFilterAndSortedRequest } from '../../dto/pagedFilterAndSortedRequest';

export interface PagedUserResultRequestDto extends PagedFilterAndSortedRequest {
    keyword: string
}
export interface PagedUserResultRequesttDto extends PagedFilterAndSortedRequest {
    idEmployee: string;
    userName: string;
    phoneNumber: string;
    emailAddress: string;
}
export interface PagedUserResultRequestDtoUser extends PagedFilterAndSortedRequest {
    idEmployee: string;
    userName: string;
    phoneNumber: string;
    emailAddress: string;
}
export interface PagedMbomResultRequesttDto {
    pageSize: number;
    pageIndex: number;
}
