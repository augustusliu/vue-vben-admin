import { defHttp } from '/@/utils/http/axios';

import {
  RoleSearchParam,
  AddOrUpdateAuthorityParam,
  AuthorityListResult,
} from './model/rolesModel';

enum AuthorityApi {
  AuthorityListWithPagerApi = '/api/authority/listWithPager',
  AuthorityAddOrUpdateApi = '/api/authority/addOrUpdate',
  AuthorityDeleteApi = '/api/authority/del/',

}

// 分页查询角色列表
export const listAuthorityWithPager = (params: RoleSearchParam) =>
  defHttp.post<AuthorityListResult>({ url: AuthorityApi.AuthorityListWithPagerApi , params })

export const addOrUpdateAuthority = (params: AddOrUpdateAuthorityParam) =>
  defHttp.post<number>({ url: AuthorityApi.AuthorityAddOrUpdateApi , params });

export const deleteAuthority = (authorityId: number) =>
  defHttp.get<number>({ url: AuthorityApi.AuthorityDeleteApi + authorityId });
