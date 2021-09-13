import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type UserParams = BasicPageParams & {
  // ?表示参数可以为空，如果不为空的话为string类型
  name?: string;
  realName?: string;
  email?: string;
};

// 用户列表查询返回模型
export interface UserListItem {
  id: number;
  username: string;
  realName: string;
  phone: string;
  email: string;
  customerId: string;
  tenantId: string;
  createdTime: string;
  modifiedTime: string;
}

export interface UserAddOrUpdateParams {
  id: number;
  username: string;
  realName: string;
  phone: string;
  email: string;
  description: string;
  avatar: string;
}

export type UserListResultModel = BasicFetchResult<UserListItem>;
