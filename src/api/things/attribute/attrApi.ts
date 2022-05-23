import { defHttp } from '/@/utils/http/axios';
import {useGlobSetting} from "/@/hooks/setting";
import {getToken} from "/@/utils/auth";

const globSetting = useGlobSetting();
import {
  AttributeSearchParam,
  AttributeListResult,
  AddOrUpdateAttributeParam,
} from '/@/api/things/attribute/model/attributeModel';


enum AttributeApi {
  // 分页获取实体属性列表
  AttributeListPagerApi = '/api/attribute/listWithPager',
  AttributeInheritWithPagerListApi = '/api/attribute/listWithInheritPager',
  AttributeAllApi = '/api/attribute/listAllAttrs',
  AttributeTelemetryListWithPager = '/api/attribute/telemetry',
  // 更新或者添加实体某个属性
  AttributeAddOrUpdate = '/api/attribute/',
  AttributeDel = '/api/attribute/del/',

  //ws
  AttributeTelemetryWsApi = '/api/ws/telemetry',
}

// 分页查询对应的资产列表
export const listAttribute = (params: AttributeSearchParam) =>
  defHttp.post<AttributeListResult>({ url: AttributeApi.AttributeListPagerApi , params });

export const listInheritAttribute = (params: AttributeSearchParam) =>
  defHttp.post<AttributeListResult>({ url: AttributeApi.AttributeInheritWithPagerListApi , params });

export const listEntityTelemetry = (params: AttributeSearchParam) =>
  defHttp.post<AttributeListResult>({ url: AttributeApi.AttributeTelemetryListWithPager , params });

export const addAttribute = (params: AddOrUpdateAttributeParam) =>
  defHttp.post<number>({ url: AttributeApi.AttributeAddOrUpdate + params.entityType +"/" +params.entityId , params });

export const delAttribute = (attributeId: number) =>
  defHttp.get<number>({ url: AttributeApi.AttributeDel + attributeId });

export const getAllAttributesByEntity = (entityId: number, entityType: string) =>
  defHttp.get<AttributeListItem[]>({ url: AttributeApi.AttributeAllApi + '?entityId=' + entityId + '&entityType=' + entityType });

export const getAttributeTelemetryWsApi = (entityId: number) => {
  return globSetting.wsUrl + AttributeApi.AttributeTelemetryWsApi +"?subTopic=deviceAttrTelemetry&deviceId=" + entityId +"&token=" + getToken()}

