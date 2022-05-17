import {BasicFetchResult, BasicPageParams} from '/@/api/model/baseModel';

// 区域搜索项目
export type modelSearchParams = BasicPageParams & {
  id?: number;
  modelName?: string;
  isEnabled?: boolean;
  isMain?: boolean;
};


export interface ModelItem {
  id: number;
  modelName: string;
  modelPath: string;
  isEnabled: boolean;
  isMain: boolean;
  createTime: number;
}

export type ModelListResultModel = BasicFetchResult<ModelItem>;


