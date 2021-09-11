import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type MenuSearchParams = BasicPageParams & {
  // ?表示参数可以为空，如果不为空的话为string类型
  name?: string;
  disabled?: boolean;
};

// 菜单返回列表
export interface MenuListItem {
  id: string;
  name: string;
  nameSearch: string;
  path: string;
  component: string;
  redirect: string;
  disabled: boolean;
  orderNo: number;
  createdTime: string;
  parentId: string;
  hideMenu: boolean;
  hideBreadcrumb: boolean;
  icon: string;
  children: MenuListItem;
}

export interface MenuAddOrUpdateParams {
  id: string;
  name: string;
  i18nTitle: string;
  nameSearch: string;
  path: string;
  component: string;
  redirect: string;
  disabled: boolean;
  orderNo: number;
  createdTime: string;
  parentId: string;
  hideMenu: boolean;
  hideBreadcrumb: boolean;
  icon: string;
}

export type MenuListResultModel = BasicFetchResult<MenuListItem>;
