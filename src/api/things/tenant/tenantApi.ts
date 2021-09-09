import { defHttp } from '/@/utils/http/axios';
import {
  TenantParams,
  TenantAddOrUpdateParams,
  TenantListItem,
  TenantListResultModel,
} from '/@/api/things/tenant/model/tenantModel';

import {
  TenantProfileSearchParams,
  TenantProfileAddOrUpdateParams,
  TenantProfileListItem,
  TenantProfileListResultModel,
} from '/@/api/things/tenant/model/tenantProfileModel';

enum Api {
  TenantList = '/api/tenant/list',
  TenantCreateOrUpdate = '/api/tenant/createOrUpdate',
  TenantDel = '/api/tenant/del?tenantId=',
  TenantGet = '/api/tenant/get?tenantId=',

  TenantProfileList = '/api/tenant/profile/list',
  TenantProfileDel = '/api/tenant/profile/del',
  TenantProfileGet = '/api/tenant/profile/get',
  TenantProfileCreateOrUpdate = '/api/tenant/profile/createOrUpdate',
}
export const getTenant = (params: number) =>
  defHttp.get<TenantListItem>({ url: Api.TenantGet, params });

export const listTenantApi = (params: TenantParams) =>
  defHttp.post<TenantListResultModel>({ url: Api.TenantList, params });

export const createOrUpdateTenantApi = (params: TenantAddOrUpdateParams) =>
  defHttp.post<number>({ url: Api.TenantCreateOrUpdate, params });

export const delTenant = (params: number) => defHttp.get<number>({ url: Api.TenantDel, params });

export const getTenantProfileApi = (params: number) =>
  defHttp.get<TenantProfileListItem>({ url: Api.TenantProfileGet, params });

export const delTenantProfileApi = (params: number) =>
  defHttp.get<number>({ url: Api.TenantProfileDel, params });

export const listTenantProfileApi = (params: TenantProfileSearchParams) =>
  defHttp.get<TenantProfileListResultModel>({ url: Api.TenantProfileList, params });

export const createOrUpdateTenantProfileApi = (params: TenantProfileAddOrUpdateParams) =>
  defHttp.get<number>({ url: Api.TenantProfileList, params });
