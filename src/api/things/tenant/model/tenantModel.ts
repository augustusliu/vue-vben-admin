
import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

// 租户搜索时的模型
export type TenantParams = BasicPageParams & {
  // ?表示参数可以为空，如果不为空的话为string类型
  name?: string;
  email?: string;
  city?: string;
  phone?: string;
  enabled?: boolean;
};

// 租户列表查询返回模型
export interface TenantListItem {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  province: string;
  city: string;
  country: string;
  createdTime: string;
}
// 创建、更新租户模型

export interface TenantAddOrUpdateParams {

  id: number;
  name: string;
  email: string;
  phone: string;
  enabled: boolean;
  address: string;
  addressDetail: string;
  province: string;
  city: string;
  country: string;
  zipcode: string;
  tenantProfileId: number;
}

export type TenantListResultModel = BasicFetchResult<TenantListItem>;

