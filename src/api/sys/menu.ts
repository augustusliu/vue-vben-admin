import { defHttp } from '/@/utils/http/axios';
import { getMenuListResultModel } from './model/menuModel';

enum Api {
  // GetMenuList = '/getMenuList',
  GetMenuList = '/api/menu/list',
}

/**
 * @description: Get user menu based on id
 */
export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};
