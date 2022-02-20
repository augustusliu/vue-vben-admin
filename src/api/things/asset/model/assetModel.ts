import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

// 资产搜索时的模型
export type AssetParams = BasicPageParams & {
  // ?表示参数可以为空，如果不为空的话为string类型
  name?: string;
  code?: string;
  label?: string;
  disabled?: boolean;
};

// 资产列表查询返回模型
export interface AssetListItem {
  id: number;
  name: string;
  code: string;
  label: string;
  icon: string;
  description: string;
  userId: number;
  disabled: boolean;
  customerId: number;
  customerName: string;
  tenantId: number;
  tenantName: string;
  modifiedTime: string;
  createdTime: string;
}

export interface AssetAddParam {
  id: number;
  name: string;
  code: string;
  icon: string;
  label: string;
  description: string;
  disabled: boolean;
}

export type AssetListResultModel = BasicFetchResult<AssetListItem>;
