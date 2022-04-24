import { defHttp } from '/@/utils/http/axios';
import {MetricItem, MetricPieItem} from "/@/api/things/metrics/model/metricModel";

enum MetricApiEnum {
  ListFieldMetricApi = '/api/metric/fields',
  AlarmTypePieApi = '/api/metric/alarmPie',
  DeviceTransportPieApi = '/api/metric/device/transport',
  DeviceLabelPieApi = '/api/metric/device/label',

}

// 获取统计页面卡片头部数据
export const getMetricCards = (metricTypes: string) =>{
  if(metricTypes){
    return defHttp.get<MetricItem[]>({ url: MetricApiEnum.ListFieldMetricApi + "?metricTypes=" + metricTypes});
  }else{
    return defHttp.get<MetricItem[]>({ url: MetricApiEnum.ListFieldMetricApi});
  }
}

export const getAlarmTypePie = () =>
  defHttp.get<MetricPieItem[]>({ url: MetricApiEnum.AlarmTypePieApi });

export const getDeviceTransportPie = () =>
  defHttp.get<MetricPieItem[]>({ url: MetricApiEnum.DeviceTransportPieApi });

export const getDeviceLabelPie = () =>
  defHttp.get<MetricPieItem[]>({ url: MetricApiEnum.DeviceLabelPieApi });
