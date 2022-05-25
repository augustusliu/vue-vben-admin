import { defHttp } from '/@/utils/http/axios';

import {
  DictionaryParams,
  DictionaryAddOrUpdateItem,
  DictionaryItem, DictionaryListResultModel
} from '/@/api/things/dictionary/model/dictionaryModel';

const Asset_Label_Dic_Code = 'Things-Asset-Labels';
const Device_Label_Dic_Code = 'Things_Device_Labels';

enum DictionaryApi {
  DictionaryAddOrUpdateApi = '/api/dictionary/createOrUpdate',
  DictionaryListWithPagerApi = '/api/dictionary/list',
  DictionaryListAllByParentApi = '/api/dictionary/listByParentId/',
  DictionaryListAllByTypeApi = '/api/dictionary/listByDictionaryType/',
  DictionaryListAllByTypeOneApi = '/api/dictionary/listByDictionaryTypeOne/',
  DictionaryListAllApi = '/api/dictionary/listAll',
  DictionaryTypesApi = '/api/dictionary/listTypes',
  DictionaryDeleteApi = '/api/dictionary/del/',


  // 查询字典标签数据
  DictionaryListLabelsApi = '/api/dictionary/listByParentCode/'
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

// 查询资产标签字典
export const listDictionaryAssetLabels = () =>
  defHttp.get<Array<DictionaryItem>>({ url: DictionaryApi.DictionaryListLabelsApi+ Asset_Label_Dic_Code });

// 查询设备标签字典
export const listDictionaryDeviceLabels = () =>
  defHttp.get<Array<DictionaryItem>>({ url: DictionaryApi.DictionaryListLabelsApi+ Device_Label_Dic_Code });
