import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type AttributeSearchParam = BasicPageParams & {
  // ?表示参数可以为空，如果不为空的话为string类型
  entityId?: number;  //实体id
  entityType?: string;  //实体类型
  name?: string;
  code?: string;
};

export interface AddOrUpdateAttributeParam {
  id: number;
  name: string;
  code: string;
  readWrite: string;
  attributeScope: string;
  valueType: string;
  entityId: number;
  entityType: string;
}

export interface AttributeListItem {
  id: number;
  entityId: number,
  entityType: string,
  entityName: string,
  name: string;
  code: string;
  valueType: string;
  readWrite: string;
  attributeScope: string;
  lastValue: string;
  lastValueTs: number
  attributeSrc: string;
  createdTime: string;
}


export interface LatestTelemetryItem {
  id: number,
  name: string,
  lastValue: string,
  lastValueTs: number

  // 设备信息
  deviceId: number,
  deviceName:string,
}

export type AttributeListResult = BasicFetchResult<AttributeListItem>;
