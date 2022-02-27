import { defHttp } from '/@/utils/http/axios';

import {
  RelationAtlasSearchParam,
  RelationAtlasModel,
  ListEntitiesResult,
} from './model/relationModel'

enum RelationApi {
  RelationAtlasApi = '/api/relation/atlas',
  RelationAddOrUpdateApi = '/api/relation/addOrUpdate',
  RelationDelApi = '/api/relation/del/',
  RelationEntitiesListApi = 'api/relation/entities/'
}

// 查询关系图谱
export const relationAtlas = (params: RelationAtlasSearchParam) =>
  defHttp.post<RelationAtlasModel>({ url: RelationApi.RelationAtlasApi, params });

// 编辑或者更新关系
export const relationAddOrUpdate = (params: any) =>
  defHttp.post<number>({ url: RelationApi.RelationAddOrUpdateApi, params });

// 删除关系
export const relationDel = (relationId: number) =>
  defHttp.get<number>({ url: RelationApi.RelationDelApi + relationId });

// 获取全局实体列表
export const listAllEntities = (entityType: string, fuzzy: string) =>
  defHttp.get<ListEntitiesResult>({ url: RelationApi.RelationEntitiesListApi + entityType +"?fuzzy=" + fuzzy });
