import { defHttp } from '/@/utils/http/axios';

import {
  MenuSearchParams,
  MenuAddOrUpdateParams,
  MenuListResultModel,
} from '/@/api/things/menu/model/menuModel';

enum MenuApi {
  MenuListAll = '/api/menu/listAll',
  MenuCreateOrUpdate = '/api/menu/createOrUpdate',
  MenuChildren = '/api/menu/children/',
  MenuSearch = '/api/menu/search',
  MenuDel = '/api/menu/del/'
}

export const listAllMenuApi = () =>
  defHttp.get<MenuListResultModel>({ url: MenuApi.MenuListAll});
export const delMenuApi = (param: string) =>
  defHttp.get<string>({ url: MenuApi.MenuDel + param});

export const searchMenuByPagerApi = (params: MenuSearchParams) =>
  defHttp.post<MenuListResultModel>({ url: MenuApi.MenuSearch, params });

export const listMenuByParentApi = (params: string) =>
  defHttp.post<MenuListResultModel>({ url: MenuApi.MenuChildren, params });

export const createOrUpdateMenuApi = (params: MenuAddOrUpdateParams) =>
  defHttp.post<string>({ url: MenuApi.MenuCreateOrUpdate, params });
