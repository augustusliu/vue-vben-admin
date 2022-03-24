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
  EntityGroupOrUpdate = '/api/group/addOrUpdate'
}

export const addOrUpdateEntityGroup = (params: AddOrUpdateEntityGroup) =>
  defHttp.post<number>({ url: EntityGroupApi.EntityGroupOrUpdate, params });

export const listEntityGroupByPager = (params: EntityGroupParams) =>
  defHttp.post<EntityGroupListResult>({ url: EntityGroupApi.EntityGroupListWithPager , params });

export const getEntityGroup = (entityGroupId: string) =>
  defHttp.get<EntityGroupItem>({ url: EntityGroupApi.EntityGroupGet + entityGroupId });

export const delEntityGroup = (entityGroupId: string) =>
  defHttp.get<number>({ url: EntityGroupApi.EntityGroupDelete + entityGroupId });
