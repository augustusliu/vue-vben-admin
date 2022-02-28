import { defHttp } from '/@/utils/http/axios';

import {
  AttributeSearchParam,
  AttributeListResult,
  AddOrUpdateAttributeParam,
} from '/@/api/things/attribute/model/attributeModel';

enum AttributeApi {
  // 分页获取实体属性列表
  AttributeListPagerApi = '/api/attribute/listWithPager',
  AttributeInheritWithPagerListApi = '/api/attribute/listWithInheritPager',
  // 更新或者添加实体某个属性
  AttributeAddOrUpdate = '/api/attribute/',
  AttributeDel = '/api/attribute/del/',
}

// 分页查询对应的资产列表
export const listAttribute = (params: AttributeSearchParam) =>
  defHttp.post<AttributeListResult>({ url: AttributeApi.AttributeListPagerApi , params });

export const listInheritAttribute = (params: AttributeSearchParam) =>
  defHttp.post<AttributeListResult>({ url: AttributeApi.AttributeInheritWithPagerListApi , params });

export const addAttribute = (params: AddOrUpdateAttributeParam) =>
  defHttp.post<number>({ url: AttributeApi.AttributeAddOrUpdate + params.entityType +"/" +params.entityId , params });

export const delAttribute = (attributeId: number) =>
  defHttp.get<number>({ url: AttributeApi.AttributeDel + attributeId });

