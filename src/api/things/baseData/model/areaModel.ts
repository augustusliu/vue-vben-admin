import {BasicFetchResult, BasicPageParams} from '/@/api/model/baseModel';

// 区域搜索项目
export type areaSearchParams = BasicPageParams & {
  name?: string;
};

export interface AreaAddOrUpdateItem {
  name: string;
  code: string;
  nameEn: string;
  zipCode: string;
  longitude: number;
  latitude: number;
  parent: string;
}

export interface AreaItem {
  name: string;
  code: string;
  nameEn: string;
  zipCode: string;
  longitude: number;
  latitude: number;
  parent: string;
  children: AreaItem[];
}
export type AreaListResultModel = BasicFetchResult<AreaItem>;
