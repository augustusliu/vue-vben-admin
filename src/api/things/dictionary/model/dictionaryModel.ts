import {BasicFetchResult, BasicPageParams} from '/@/api/model/baseModel';

export interface DictionaryAddOrUpdateItem {
  id: number;
  name: string;
  code: string;
  dictionaryType: string;
  systemDefault: boolean;
  parentId:number;
}
// 字典搜索项目
export type DictionaryParams = BasicPageParams & {
  name?: string;
  code?: string;
  dictionaryType?: string;
  systemDefault?: boolean;
};

export interface DictionaryItem {
  id: number;
  name: string;
  code: string;
  dictionaryType: string;
  systemDefault: boolean;
  createdTime:number;
  modifiedTime:number;
  parentId: number;
  hasChild: boolean;
  children: DictionaryItem[];
}


export type DictionaryListResultModel = BasicFetchResult<DictionaryItem>;
