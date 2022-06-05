import {BasicFetchResult} from "/@/api/model/baseModel";

// 地区信息字段
export interface AreaItem {
  code: string;
  name: string;
  zipCode: string;
  children: AreaItem[];
}

// 显示行业
export interface IndustryItem {
  code: string;
  name: string;
  parentCode: string;
  children: IndustryItem[];
}

export interface ImportAssetItem {
  code: string;
  name: string;
  icon: string;
  disabled: boolean;
  description?: string;
}

export interface ImportAssetByModel {
  modelId: number;
  assets: ImportAssetItem[];
}



export type AreasResult = BasicFetchResult<AreaItem>;
export type IndustryResult = BasicFetchResult<IndustryItem>;
