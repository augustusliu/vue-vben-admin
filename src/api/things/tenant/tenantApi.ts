import { defHttp } from '/@/utils/http/axios';
import {
  TenantParams,
  TenantAddOrUpdate,
  TenantListResultModel,
} from '/@/api/things/tenant/model/tenantModel';

enum Api {
  TenantList = '/api/tenant/list',
  TenantCreateOrUpdate = '/api/tenant/createOrUpdate',
  TenantDel = '/api/tenant/del?tenantId=',
  TenantGet = '/api/tenant/get?tenantId=',
}
export const getTenant = (params: number) =>
  defHttp.get<TenantListResultModel>({ url: Api.TenantGet, params });

export const listTenantApi = (params: TenantParams) =>
  defHttp.post<TenantListResultModel>({ url: Api.TenantList, params });

export const createOrUpdateTenantApi = (params: TenantAddOrUpdate) =>
  defHttp.post<number>({ url: Api.TenantCreateOrUpdate, params });

export const delTenant = (params: number) => defHttp.get<number>({ url: Api.TenantDel, params });
