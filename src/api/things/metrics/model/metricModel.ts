import { BasicFetchResult } from '/@/api/model/baseModel';


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

export type MetricListResultModel = BasicFetchResult<MetricItem>;
