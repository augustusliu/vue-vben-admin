import { defHttp } from '/@/utils/http/axios';

import {
  DeviceParams,
  DeviceItem,
  DeviceAddParam,
  DeviceCredentialsModel,
  DeviceListResultModel,
  DeviceListAllResultModel,
} from '/@/api/things/device/model/deviceModel';

enum DeviceApi {
  DeviceTransportsApi = '/api/device/transport',
  DeviceListWithPageApi = '/api/device/listWithPage',
  DeviceListAllApi = '/api/device/listAll',
  DeviceOneGetApi = '/api/device/get/',
  DeviceAddOrUpdateApi = '/api/device/addOrUpdate',
  DeviceCredentialsGetApi = '/api/device/credentials/get/',
  DeviceDeletedApi = '/api/device/del/',
  DeviceLabelsApi = '/api/device/labels',
}

// 分页查询
export const listDeviceWithPageApi = (params: DeviceParams) =>
  defHttp.post<DeviceListResultModel>({ url: DeviceApi.DeviceListWithPageApi, params });
// 全量查询
export const listAllDevices = (params: DeviceParams) =>
  defHttp.post<DeviceListAllResultModel>({ url: DeviceApi.DeviceListAllApi, params });

export const getDeviceApi = (deviceId: string) =>
  defHttp.get<DeviceItem>({ url: DeviceApi.DeviceOneGetApi + deviceId });

export const addOrUpdateDeviceApi = (params: DeviceAddParam) =>
  defHttp.post<string>({ url: DeviceApi.DeviceAddOrUpdateApi, params });

export const getCredentialsApi = (deviceId: string) =>
  defHttp.get<DeviceCredentialsModel>({ url: DeviceApi.DeviceCredentialsGetApi + deviceId });

// 获取设备所有的协议列表
export const delDeviceApi = (deviceId: string) =>
  defHttp.get<string>({ url: DeviceApi.DeviceDeletedApi + deviceId});

export const listDeviceLabels = () =>
  defHttp.get<string>({ url: DeviceApi.DeviceLabelsApi });
