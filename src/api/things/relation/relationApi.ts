import { defHttp } from '/@/utils/http/axios';

import {
  RelationAtlasModel,
  ListEntitiesResult,
  RelationEntityAllInfo,
} from './model/relationModel'

enum RelationApi {
  RelationAtlasApi = '/api/relation/atlas',
  RelationAddOrUpdateApi = '/api/relation/addOrUpdate',
  RelationDelApi = '/api/relation/del/',
  RelationEntitiesListApi = '/api/entity/list',
  RelationEntityInfoApi = '/api/relation/get',
  RelationUnboundApi = '/api/relation/unbound',
}

// 查询关系图谱
export const relationAtlas = (params: any) =>
  defHttp.post<RelationAtlasModel>({ url: RelationApi.RelationAtlasApi, params });

// 编辑或者更新关系
export const relationAddOrUpdate = (params: any) =>
  defHttp.post<number>({ url: RelationApi.RelationAddOrUpdateApi, params });

// 编辑或者更新关系
export const relationUnbound = (params: any) =>
  defHttp.post<number>({ url: RelationApi.RelationUnboundApi, params });

// 删除关系
export const relationDel = (relationId: number) =>
  defHttp.get<number>({ url: RelationApi.RelationDelApi + relationId });

// 获取当前实体的关系全量信息
export const entityRelationInfo = (entityId: number, entityType: string) =>
  defHttp.get<RelationEntityAllInfo>({ url: RelationApi.RelationEntityInfoApi +"?entityId="+ entityId +"&entityType=" + entityType });

// 获取全局实体列表
export const listAllEntities = (entityType: string, fuzzy: string) =>
  defHttp.get<ListEntitiesResult>({ url: RelationApi.RelationEntitiesListApi +"?entityType="+entityType +"&fuzzy=" + fuzzy });
