import { defHttp } from '/@/utils/http/axios';

import {
  AreasResult,
  IndustryResult
} from "/@/api/things/common/model/commonModel";

enum CommonApi {
  // 获取全部地区信息
  AreaListAll = '/api/area/listAll',
  AreaListAllByParent = '/api/area/listByParent/',
  IndustryListAll = '/api/industry/listAll',
  IndustryListByParent = '/api/industry/listByParent/'
}

export const listAreas = () =>
  defHttp.get<AreasResult>({ url: CommonApi.AreaListAll });
export const listAreasByParent = (parentCode: string) =>
  defHttp.get<AreasResult>({ url: CommonApi.AreaListAllByParent + parentCode });

export const listIndustryAll = () =>
  defHttp.get<IndustryResult>({ url: CommonApi.IndustryListAll });

export const listIndustryByParent = (parentCode: string) =>
  defHttp.get<IndustryResult>({ url: CommonApi.IndustryListByParent + parentCode });
