import { defHttp } from '/@/utils/http/axios';

import {
  UserParams,
  UserListItem,
  UserAddOrUpdateParams,
  UserListResultModel,
} from '/@/api/things/userMgr/model/userModel';

enum UserApi {
  UserCreateOrUpdate = '/api/user/createOrUpdate',
  UserListByPager = '/api/user/listByPager',
  UserDel = '/api/user/del/',
  UserGet = '/api/user/get/',
}

export const getUserApi = (params: string) =>
  defHttp.get<UserListItem>({ url: UserApi.UserGet + params });

export const delUserApi = (params: string) =>
  defHttp.get<string>({ url: UserApi.UserDel + params });

export const listUserApi = (params: UserParams) =>
  defHttp.post<UserListResultModel>({ url: UserApi.UserListByPager, params });

export const createOrUpdateUserApi = (params: UserAddOrUpdateParams) =>
  defHttp.post<string>({ url: UserApi.UserCreateOrUpdate, params });
