import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type TemplateParams = BasicPageParams & {
  // ?表示参数是可选项，可能存在，可能不存在
  id?: number;
  name?: string;
  enabled?: boolean;
};

// 添加模板是的参数
export interface AddOrUpdateTemplate {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
}

export interface TemplateItem {
  id: number;
  name: string;
  description: string;
  enabled: boolean;
  createdTime: string;
  modifiedTime: string;
}

export type TemplateListResult = BasicFetchResult<TemplateItem>;
