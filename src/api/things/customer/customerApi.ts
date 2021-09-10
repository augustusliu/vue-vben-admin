import { defHttp } from '/@/utils/http/axios';

import {
  CustomerParams,
  CustomerListItem,
  CustomerAddOrUpdateParams,
  CustomerListResultModel,
} from '/@/api/things/customer/model/customerModel';

enum CustomerApi {
  CustomerCreateOrUpdate = '/api/customer/createOrUpdate',
  CustomerListByPager = '/api/customer/list',
  CustomerDel = '/api/customer/del/',
  CustomerGet = '/api/customer/get/',
}

export const getCustomerApi = (params: string) =>
  defHttp.get<CustomerListItem>({ url: CustomerApi.CustomerGet + params });
export const delCustomerApi = (params: string) =>
  defHttp.get<string>({ url: CustomerApi.CustomerDel + params });
export const listCustomerApi = (params: CustomerParams) =>
  defHttp.post<CustomerListResultModel>({ url: CustomerApi.CustomerListByPager, params });

export const createOrUpdateCustomerApi = (params: CustomerAddOrUpdateParams) =>
  defHttp.post<string>({ url: CustomerApi.CustomerCreateOrUpdate, params });
