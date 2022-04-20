import { BasicFetchResult } from '/@/api/model/baseModel';


export interface MetricItem {
  metricType: string;
  metricName: string;
  metricValue: number;
  metricTotalValue: number;
  metricTotalName: string;
}

export type MetricListResultModel = BasicFetchResult<MetricItem>;
