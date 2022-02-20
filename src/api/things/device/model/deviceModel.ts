import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

// 设备搜索项
export type DeviceParams = BasicPageParams & {
  // ?表示参数可以为空，如果不为空的话为string类型
  name?: string;
  code?: string;
  label?: string;
  isGateway?: boolean;
  disabled: boolean;
  transportType?: string;
};

export interface DeviceItem {
  id: number;
  name: string;
  code: string;
  icon: string;
  disabled: boolean;
  isGateway: string;
  transportType: string;
  label: string;
  description: string;
  userId: number;
  modifiedTime: string;
  createdTime: string;
}

export interface DeviceAddParam {
  id: number;
  name: string;
  code: string;
  isGateway: string;
  transportType: string;
  disabled: boolean;
  label: string;
  icon: string;
  description: string;
}

// 资产kv列表实体
export interface DeviceKVItem {
  id: number;
  name: string;
}

export interface DeviceCredentialsModel {
  id: number;
  deviceId: number;
  credentialsToken: string;
  credentialsValue: string;
  credentialsType: string;
}

export type DeviceListResultModel = BasicFetchResult<DeviceItem>;

export type DeviceListAllResultModel = BasicFetchResult<DeviceKVItem>;
