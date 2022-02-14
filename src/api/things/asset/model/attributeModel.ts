import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type AttributeParam = BasicPageParams & {
  // ?表示参数可以为空，如果不为空的话为string类型
  assetId?: number;
  name?: string;
  code?: string;
};

// 添加属性是的参数
export interface AddOrUpdateAttributeParam {
  id: number;
  name: string;
  code: string;
  readWrite: string;
  attributeScope: string;
  valueType: string;
}

export interface AttributeItem {
  id: number;
  name: string;
  code: string;
  valueType: string;
  readWrite: string;
  attributeScope: string;
  createdTime: string;
}

export type AttributeListResult = BasicFetchResult<AttributeItem>;
