import { BasicFetchResult } from '/@/api/model/baseModel';
import {AlarmListItem} from "/@/api/things/alarm/model/alarmModel";

export interface MetricItem {
  metricType: string;
  metricName: string;
  metricValue: number;
  metricTotalValue: number;
  metricTotalName: string;
  icon:string;
  iconColor:string;
}

export interface MetricPieItem{
  name: string;
  value: number;
}


export interface DeviceHistoryTemplateSearch {
  entityId: number;
  entityType: string;
  attrCommandType: string;
  startTime:number;
  endTime:number;
  fields?:string[]
}

export interface HistoryTemplateResultItem {
  id: number;
  key: string;
  value: number;
  ts: number;
}
export interface HistoryTemplateResult{
  key: string;
  items: HistoryTemplateResultItem[];
}


// 告警的统计信息查询数据
export interface AlarmMetricSearchParams {
  entityId: number;
  entityType: string;
  startTime?: number;
  endTime?: number;
  periodType?: string;
}

export interface AlarmsMetricResultItem {
  alarmType: string;
  items: AlarmListItem[];
}


export interface DigitalTwinMetricCount {
  assetCount: number,
  deviceTotalCount: number,
  waitAlarmCount: number,
  deviceOnlineCount: number
}

export type MetricListResultModel = BasicFetchResult<MetricItem>;
