import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/api/auth/login',
  Logout = '/api/auth/logout',
  GetUserInfo = '/api/auth/user',
  GETAuthoritiesCode = '/api/auth/authoritiesId',
}

/**
 * user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    }
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo });
}

/**
 * 获取用户的ID,
 */
export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GETAuthoritiesCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}
