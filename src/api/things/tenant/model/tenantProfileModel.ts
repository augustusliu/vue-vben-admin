import { BasicPageParams, BasicListResult } from '/@/api/model/baseModel';

// 租户搜索时的模型
export type TenantProfileSearchParams = BasicPageParams & {
  // ?表示参数可以为空，如果不为空的话为string类型
  name?: string;
  isDefault?: boolean;
  isolatedBusiness?: boolean;
  isolatedRuleEngine?: boolean;
};

// 租户画像列表查询返回模型
export interface TenantProfileListItem {
  id: number;
  name: string;
  isDefault: boolean;
  isolatedBusiness: boolean;
  isolatedRuleEngine: boolean;
  maxDevices: number;
  maxCustomers: number;
  maxUsers: number;
  createdTime: string;
  modifiedTime: string;
}

// 创建、更新租户画像
export interface TenantProfileAddOrUpdateParams {
  id: number;
  name: string;
  isDefault: boolean;
  isolatedBusiness: boolean;
  isolatedRuleEngine: boolean;
  maxDevices: number;
  maxCustomers: number;
  maxUsers: number;
  maxRuleChains: number;
  maxTransportMessage: number;
  maxTransportDataPoint: number;
  maxBizExecutors: number;
  maxJsExecutor: number;
  maxStorageDays: number;
  maxTenantMsgRateLimit: string;
  maxTenantTelemetryMsgRateLimit: string;
}

export type TenantProfileListResultModel = BasicListResult<TenantProfileListItem>;
