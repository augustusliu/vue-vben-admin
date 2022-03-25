import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type EntityGroupParams = BasicPageParams & {
  // ?表示参数是可选项，可能存在，可能不存在
  id?: number;
  name?: string;
  entityType?: string;
};

// 添加设备分组是的参数
export interface AddOrUpdateEntityGroup {
  id: number;
  name: string;
  description: string;
  entityType: string;
}

export interface EntityGroupItem {
  id: number;
  name: string;
  description: string;
  entityType: string;
  createdTime: string;
  modifiedTime: string;
}

export type EntityGroupListResult = BasicFetchResult<EntityGroupItem>;
