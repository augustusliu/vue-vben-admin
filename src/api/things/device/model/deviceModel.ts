import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

// 设备搜索项
export type DeviceParams = BasicPageParams & {
  // ?表示参数可以为空，如果不为空的话为string类型
  id?: number;
  name?: string;
  code?: string;
  label?: string;
  isGateway?: boolean;
  disabled: boolean;
  transportType?: string;
};

// 下发属性或者指令的查询查询
export type DeviceIssueSearchParams = BasicPageParams & {
  // ?表示参数可以为空，如果不为空的话为string类型
  code?: number;
  issueType?: string;
  entityId?: number;
  entityType?: string;
};


export interface DeviceItem {
  id: number;
  name: string;
  code: string;
  icon: string;
  online: boolean;
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
  deviceTemplateId: number;
  deviceGroupId:number;
}

// 设备下发信息的创建
export interface DeviceIssueCreateParam {
  entityId: number | undefined;
  entityType: string | undefined;
  code: string;
  value: string;
  issueType: string;
  remark: string;
  issueSrc: string;
  keyName: string;
}

// 设备下发历史记录
export interface DeviceIssueListItem {
  id: number;
  entityId: number;
  entityType: string;
  key: string;
  value: string;
  ts: number;
  issueStatus: boolean;
  issueType: string;
  remark: string;
  issueSrc: string;
  reason: string;
  creatorName: string;
  keyName: string;
  entityName: string;
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

export type DeviceListIssueResultModel = BasicFetchResult<DeviceIssueListItem>;
