import { defHttp } from '/@/utils/http/axios';

import {
  DealAlarmParams,
  AlarmParams,
  AlarmListResultModel,
} from './model/alarmModel';

enum AlarmApi {
  AlarmListWithPagerApi = '/api/alarm/search',
  AlarmDealApi = '/api/alarm/deal',
}

// 获取告警列表api
export const listAlarmApi = (params: AlarmParams) =>
  defHttp.post<AlarmListResultModel>({ url: AlarmApi.AlarmListWithPagerApi, params });

// 处理告警api
export const dealAlarmApi = (params: DealAlarmParams) =>
  defHttp.post<number>({ url: AlarmApi.AlarmDealApi, params });
