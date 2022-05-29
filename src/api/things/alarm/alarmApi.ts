import { defHttp } from '/@/utils/http/axios';

import {
  DealAlarmParams,
  AlarmParams,
  AlarmListResultModel,
  AlarmLogsResultModel, AlarmListItem, AlarmLatestItem,
} from './model/alarmModel';

enum AlarmApi {
  AlarmListWithPagerApi = '/api/alarm/search',
  AlarmDealApi = '/api/alarm/deal',
  AlarmLogsApi = '/api/alarm/logs',
  AlarmInfoGetApi = '/api/alarm/get',

  AlarmLatestInTenantApi = '/api/alarm/latestAlarm',
}

// 获取告警列表api
export const listAlarmApi = (params: AlarmParams) =>
  defHttp.post<AlarmListResultModel>({ url: AlarmApi.AlarmListWithPagerApi, params });

// 处理告警api
export const dealAlarmApi = (params: DealAlarmParams) =>
  defHttp.post<number>({ url: AlarmApi.AlarmDealApi, params });

// 处理告警api
export const listAlarmLogsApi = (alarmId: number) =>
  defHttp.get<AlarmLogsResultModel>({ url: AlarmApi.AlarmLogsApi + "?alarmId=" + alarmId });

// 处理告警api
export const getAlarmInfoApi = (alarmId: any) =>
  defHttp.get<AlarmListItem>({ url: AlarmApi.AlarmInfoGetApi + "?alarmId=" + alarmId });


export const getTenantLatestAlarms = () =>
  defHttp.get<AlarmLatestItem[]>({ url: AlarmApi.AlarmLatestInTenantApi});


