import { defHttp } from '/@/utils/http/axios';

import {
  EntityGroupParams,
  AddOrUpdateEntityGroup,
  EntityGroupItem,
  EntityGroupListResult
} from '/@/api/things/entityGroup/model/entityGroup'

enum EntityGroupApi {
  EntityGroupListWithPager = '/api/group/listWithPager',
  EntityGroupGet = '/api/group/get/',
  EntityGroupDelete = '/api/group/del/',
  EntityGroupAddOrUpdate = '/api/group/addOrUpdate',
  EntityGroupListAll = '/api/group/list?'
}

export const addOrUpdateEntityGroup = (params: AddOrUpdateEntityGroup) =>
  defHttp.post<number>({ url: EntityGroupApi.EntityGroupAddOrUpdate, params });

export const listEntityGroupByPager = (params: EntityGroupParams) =>
  defHttp.post<EntityGroupListResult>({ url: EntityGroupApi.EntityGroupListWithPager , params });

export const getEntityGroup = (entityGroupId: string) =>
  defHttp.get<EntityGroupItem>({ url: EntityGroupApi.EntityGroupGet + entityGroupId });

export const delEntityGroup = (entityGroupId: string) =>
  defHttp.get<number>({ url: EntityGroupApi.EntityGroupDelete + entityGroupId });

export const listAllEntityGroup = (params: EntityGroupParams) =>
  defHttp.get<EntityGroupListResult>({ url: EntityGroupApi.EntityGroupListAll + 'fuzzy=' + params.name +'&entityType=' + params.entityType });
