import {BasicFetchResult, BasicPageParams} from '/@/api/model/baseModel';


// 字典搜索项目
export type IndustrySearchParams = BasicPageParams & {
  name?: string;
};

export interface IndustryAddOrUpdateItem {
  name: string;
  code: string;
  parentCode: string;
}

export interface IndustryItem {
  name: string;
  code: string;
  parentCode: string;
  children: IndustryItem[];
}

export type IndustryListResultModel = BasicFetchResult<IndustryItem>;


