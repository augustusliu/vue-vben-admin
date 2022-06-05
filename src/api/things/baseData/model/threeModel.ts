import {BasicFetchResult, BasicPageParams} from '/@/api/model/baseModel';

// 区域搜索项目
export type modelSearchParams = BasicPageParams & {
  id?: number;
  modelName?: string;
  isEnabled?: boolean;
  isMain?: boolean;
};

export interface modelSearchParamsWithoutPager{
  id?: number;
  modelName?: string;
  isEnabled?: boolean;
  isMain?: boolean;
};


// 更新
export interface modelUpdateInfoParams {
  id: number;
  isEnabled: boolean;
  isMain: boolean;
  parentId: number;
}

export interface ModelItem {
  id: number;
  parentId: number;
  parentName: string;
  modelName: string;
  modelPath: string;
  isEnabled: boolean;
  isMain: boolean;
  syncAsset: boolean;
  createTime: number;
}

export type ModelListResultModel = BasicFetchResult<ModelItem>;


