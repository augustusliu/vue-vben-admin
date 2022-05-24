import { defHttp } from '/@/utils/http/axios';
import {
  MetricItem,
  MetricPieItem,
  DeviceHistoryTemplateSearch,
  HistoryTemplateResult, AlarmMetricSearchParams, AlarmsMetricResultItem
} from "/@/api/things/metrics/model/metricModel";
import {AlarmListItem} from "/@/api/things/alarm/model/alarmModel";

enum MetricApiEnum {
  ListFieldMetricApi = '/api/metric/fields',
  DeviceTransportPieApi = '/api/metric/device/transport',
  DeviceLabelPieApi = '/api/metric/device/label',
  // 看板页面告警饼图
  AlarmTypePieApi = '/api/metric/alarmPie',
  DeviceHistoryTemplateApi = '/api/telemetry/history/listLine',


  // 设备监控页面告警历史数据,
  AlarmsLineListApi = '/api/alarm/alarmLineList',
  // 设备告警分组数据
  AlarmsGroupByTimeApi = '/api/alarm/alarmsGroupByTime',
  AlarmsGroupByTypeApi = '/api/alarm/alarmsGroupByType',
  // 按照时间和类型进行分组
  AlarmGroupByTimeAndTypeApi = '/api/alarm/alarmsMetricV1',
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


// 获取设备历史数据
export const getDeviceHistoryData = (params: DeviceHistoryTemplateSearch) =>
  defHttp.post<HistoryTemplateResult[]>({ url: MetricApiEnum.DeviceHistoryTemplateApi, params});


// 获取设备资产告警的历史数据
export const getAlarmsLineApi = (params: AlarmMetricSearchParams) =>
  defHttp.post<AlarmListItem[]>({ url: MetricApiEnum.AlarmsLineListApi, params});
// 获取设备资产告警的按时间分组数据
export const getAlarmsGroupByTimeApi = (params: AlarmMetricSearchParams) =>
  defHttp.post<AlarmsMetricResultItem[]>({ url: MetricApiEnum.AlarmsGroupByTimeApi, params});

// 获取设备资产告警的按类型分组数据
export const getAlarmsGroupByTypeApi = (params: AlarmMetricSearchParams) =>
  defHttp.post<AlarmsMetricResultItem[]>({ url: MetricApiEnum.AlarmsGroupByTypeApi, params});


// 获取设备资产告警的按类型分组数据
export const getAlarmMetricByTypeAndTimeApi = (params: AlarmMetricSearchParams) =>
  defHttp.post<any>({ url: MetricApiEnum.AlarmGroupByTimeAndTypeApi, params});
