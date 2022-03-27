import {BasicFetchResult, BasicPageParams} from "/@/api/model/baseModel";
import {AttributeListItem} from "/@/api/things/attribute/model/attributeModel";

export type RoleSearchParam = BasicPageParams & {
  // ?表示参数是可选项，可能存在，可能不存在
  id?: number;
  code?: string;
  name?: string;
};

export interface AddOrUpdateAuthorityParam {
  id: number;
  name: string;
  code: string;
  description: string;
}

export interface AuthorityListItem {
  id: number;
  name: string,
  code: string,
  description: string,
  systemDefault: boolean;
  createdTime: number;
  modifiedTime: number;
}

export type AuthorityListResult = BasicFetchResult<AttributeListItem>;
