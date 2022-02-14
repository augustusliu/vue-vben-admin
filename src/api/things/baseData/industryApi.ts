import { defHttp } from '/@/utils/http/axios';

import {
  IndustrySearchParams,
  IndustryAddOrUpdateItem,
  IndustryListResultModel
} from '/@/api/things/baseData/model/industryModel';

enum IndustryApi {
  IndustrySearchApi = '/api/industry/search',
  IndustryAddApi = '/api/industry/add',
  IndustryUpdateApi = '/api/industry/update',
  IndustryListAllApi = '/api/industry/listALL',
  IndustryListByParentApi = '/api/industry/listByParent/',
  IndustryDelApi = '/api/industry/del/',
}

// 行业查询
export const searchIndustryByPager = (params: IndustrySearchParams) =>
  defHttp.post<IndustryListResultModel>({ url: IndustryApi.IndustrySearchApi, params });

export const addIndustry = (params: IndustryAddOrUpdateItem) =>
  defHttp.post<string>({ url: IndustryApi.IndustryAddApi, params });

export const updateIndustry = (params: IndustryAddOrUpdateItem) =>
  defHttp.post<string>({ url: IndustryApi.IndustryUpdateApi, params });

export const listAllIndustry = () =>
  defHttp.get<IndustryListResultModel>({ url: IndustryApi.IndustryListAllApi });
// 基于父节点查询子节点
export const listIndustryByParent = (parentCode: string) =>
  defHttp.get<IndustryListResultModel>({ url: IndustryApi.IndustryListByParentApi + parentCode });

export const delIndustry = (code: string) =>
  defHttp.get<IndustryListResultModel>({ url: IndustryApi.IndustryDelApi + code });


