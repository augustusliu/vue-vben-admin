import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

// 客户搜索时的模型
export type CustomerParams = BasicPageParams & {
  // ?表示参数可以为空，如果不为空的话为string类型
  name?: string;
  email?: string;
  phone?: string;
};

// 客户列表查询返回模型
export interface CustomerListItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  areaCode: string[];
  areaName: string;
  industryCode: string[];
  industryName: string;
  createdTime: string;
}
// 创建、更新租户模型
export interface CustomerAddOrUpdateParams {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  addressDetail: string;
  areaCode: string[];
  industryCode: string[];
  zipcode: string;
  enabled: boolean;
  authorityId: number;
}

export type CustomerListResultModel = BasicFetchResult<CustomerListItem>;
