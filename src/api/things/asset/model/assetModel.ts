import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

// 资产搜索时的模型
export type AssetParams = BasicPageParams & {
  // ?表示参数是可选项，可能存在，可能不存在
  id?:number;
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
  assetLabels: any[];
}

export interface AssetAddParam {
  id?: number;
  name: string;
  code: string;
  icon: string;
  label: any;
  description?: string;
  disabled: boolean;
}

export type AssetListResultModel = BasicFetchResult<AssetListItem>;
