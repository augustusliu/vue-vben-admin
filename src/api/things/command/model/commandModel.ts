import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type CommandSearchParam = BasicPageParams & {
  // ?表示参数可以为空，如果不为空的话为string类型
  entityId?: number;  //实体id
  entityType?: string;  //实体类型
  name?: string;
  code?: string;
};


export interface AddOrUpdateCommandParam {
  id: number;
  name: string;
  code: string;
  valueType: string;
  entityId: number;
  entityType: string;
}

export interface CommandListItem {
  id: number;
  entityId: number,
  entityType: string,
  entityName: string,
  name: string;
  code: string;
  valueType: string;
  createdTime: string;
}

export type CommandListResult = BasicFetchResult<CommandListItem>;
