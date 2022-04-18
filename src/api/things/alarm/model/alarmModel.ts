import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

// 警告查询
export type AlarmParams = BasicPageParams & {
  // ?表示参数是可选项，可能存在，可能不存在
  alarmName?: string;
  alarmType?: string;
  dealUserName?: string;
  entityId?: number;
  entityType?: string;
  dealStatus?: boolean;
  alarmTypeId?: number;
};

// 返回的参数
export interface AlarmListItem {
  id: number;
  entityId: number;
  entityName: string;
  entityType: number;
  alarmName: string;
  alarmContent: string;
  createdTime: number;
  alarmStatus: boolean;
  alarmType: string;
  belongUserId: number;
  alarmTypeId: number;
  belongUserName:string;
}

export interface DealAlarmParams {
  id: number;
  remark: string;
  status: boolean;
}

export interface AlarmLogItem {
  id: number;
  alarmId: number;
  dealTime: number;
  dealUserId: number;
  dealUserName: string;
  remark: string;
  dealStatus: string;
}

export type AlarmListResultModel = BasicFetchResult<AlarmListItem>;

export type AlarmLogsResultModel = BasicFetchResult<AlarmLogItem>;

