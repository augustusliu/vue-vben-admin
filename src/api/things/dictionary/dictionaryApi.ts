import { defHttp } from '/@/utils/http/axios';

import {
  DictionaryParams,
  DictionaryAddOrUpdateItem,
  DictionaryItem, DictionaryListResultModel
} from '/@/api/things/dictionary/model/dictionaryModel';

enum DictionaryApi {
  DictionaryAddOrUpdateApi = '/api/dictionary/createOrUpdate',
  DictionaryListWithPagerApi = '/api/dictionary/list',
  DictionaryListAllByParentApi = '/api/dictionary/listByParentId/',
  DictionaryListAllByTypeApi = '/api/dictionary/listByDictionaryType/',
  DictionaryListAllByTypeOneApi = '/api/dictionary/listByDictionaryTypeOne/',
  DictionaryListAllApi = '/api/dictionary/listAll',
  DictionaryTypesApi = '/api/dictionary/listTypes',
  DictionaryDeleteApi = '/api/dictionary/del/',
}

// 分页查询字典
export const listDictionaryByPager = (params: DictionaryParams) =>
  defHttp.post<Array<DictionaryItem>>({ url: DictionaryApi.DictionaryListWithPagerApi, params });
// 查询全量字典信息
export const listDictionaryAll = () =>
  defHttp.get<Array<DictionaryItem>>({ url: DictionaryApi.DictionaryListAllApi });
// 根据父节点查询
export const listDictionaryByParentId = (parentId: number) =>
  defHttp.get<DictionaryListResultModel>({ url: DictionaryApi.DictionaryListAllByParentApi + parentId });
// 根据类型查询（）
export const listDictionaryByType = (dictionaryType: string) =>
  defHttp.get<Array<DictionaryItem>>({ url: DictionaryApi.DictionaryListAllByTypeApi + dictionaryType });
// 获取第一条记录的值
export const listDictionaryByTypeWthParam = (param: any) =>
  defHttp.get<Array<DictionaryItem>>({ url: DictionaryApi.DictionaryListAllByTypeApi + param.dictionaryType });
// 根据类型查询
export const listDictionaryTypes = () =>
  defHttp.get<any>({ url: DictionaryApi.DictionaryTypesApi });
// 添加或者更新字典
export const dictionaryAddOrUpdate = (params: DictionaryAddOrUpdateItem) =>
  defHttp.post<number>({ url: DictionaryApi.DictionaryAddOrUpdateApi, params });
// 删除字典
export const deleteDictionary = (dictionaryId: number) =>
  defHttp.get<number>({ url: DictionaryApi.DictionaryDeleteApi + dictionaryId });
