import { defHttp } from '/@/utils/http/axios';

import {
  areaSearchParams,
  AreaAddOrUpdateItem,
  AreaListResultModel
} from '/@/api/things/baseData/model/areaModel';

enum AreaApi {
  AreaSearchApi = '/api/area/search',
  AreaAddApi = '/api/area/add',
  AreaUpdateApi = '/api/area/update',
  AreaListAllApi = '/api/area/listALL',
  AreaListByParentApi = '/api/area/listByParent/',
  AreaDelApi = '/api/area/del/',
}

// 区域查询
export const searchAreaByPager = (params: areaSearchParams) =>
  defHttp.post<AreaListResultModel>({ url: AreaApi.AreaSearchApi, params });

export const addArea = (params: AreaAddOrUpdateItem) =>
  defHttp.post<string>({ url: AreaApi.AreaAddApi, params });

export const updateArea = (params: AreaAddOrUpdateItem) =>
  defHttp.post<string>({ url: AreaApi.AreaUpdateApi, params });

export const listAllArea = () =>
  defHttp.get<AreaListResultModel>({ url: AreaApi.AreaListAllApi });
// 基于父节点查询子节点
export const listAreaByParent = (parentCode: string) =>
  defHttp.get<AreaListResultModel>({ url: AreaApi.AreaListByParentApi + parentCode });

export const delArea = (code: string) =>
  defHttp.get<AreaListResultModel>({ url: AreaApi.AreaDelApi + code });


