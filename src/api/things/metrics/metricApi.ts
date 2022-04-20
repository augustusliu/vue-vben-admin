import { defHttp } from '/@/utils/http/axios';
import {MetricItem} from "/@/api/things/metrics/model/metricModel";

enum MetricApiEnum {
  ListFieldMetricApi = '/api/metric/fields',
}

// 获取统计页面卡片头部数据
export const getMetricCards = (metricTypes: string) =>{
  if(metricTypes){
    return defHttp.get<MetricItem[]>({ url: MetricApiEnum.ListFieldMetricApi + "?metricTypes=" + metricTypes});
  }else{
    return defHttp.get<MetricItem[]>({ url: MetricApiEnum.ListFieldMetricApi});
  }
}

