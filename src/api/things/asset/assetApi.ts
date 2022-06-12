import { defHttp } from '/@/utils/http/axios';

import {
  AssetParams,
  AssetAddParam,
  AssetListItem,
  AssetListResultModel, ModelAssetSearch,
} from '/@/api/things/asset/model/assetModel';

import {
  AttributeListResult,
  AddOrUpdateAttributeParam,
} from '/@/api/things/asset/model/attributeModel';

enum AssetApi {
  // 资产列表分页查询
  AssetListByPager = '/api/asset/listByPager',
  // 资产详情信息查询
  AssetGet = '/api/asset/get/',
  // 资产下所有属性信息分页查询
  AssetAttributeListByPager = '/api/asset/attr/listWithPager',
  // 查询全部资产
  AssetListAllApi = '/api/asset/listAll',
  // 查询资产全部名称
  AssetListAllNamesApi = '/api/asset/listAllNames',
  // 资产所有名称分页查询
  AssetListAllNamesByPagerApi = '/api/asset/listNamesByPager',
  // 为资产添加一个属性信息
  AssetAddOneAttribute = '/api/asset/attr/one/',
  // 添加编辑资产
  AssetAddOrUpdateApi = '/api/asset/addOrUpdate',
  // 删除资产
  AssetDelApi = '/api/asset/del/',
  // 获取资产对应的模型
  AssetsOfThreeModelApi = '/api/asset/list3d',
}

// 分页查询对应的资产列表
export const listAssetApi = (params: AssetParams) =>
  defHttp.post<AssetListResultModel>({ url: AssetApi.AssetListByPager, params });

// 分页查询对应的资产列表
export const getAssetApi = (params: number) =>
  defHttp.get<AssetListItem>({ url: AssetApi.AssetGet + params });

export const delAssetApi = (assetId: number) =>
  defHttp.get<number>({ url: AssetApi.AssetDelApi + assetId });

// 查询资产下属性列表
export const listAttributeByAssetApi = (params: any) =>
  defHttp.post<AttributeListResult>({ url: AssetApi.AssetAttributeListByPager, params });

// 为资产添加一个属性
export const addOneAttributeApi = (_assetId: number, params: AddOrUpdateAttributeParam) =>
  defHttp.post<AttributeListResult>({ url: AssetApi.AssetAddOneAttribute + _assetId, params });

// 添加编辑资产
export const addOrUpdateAsset = (params: AssetAddParam) =>
  defHttp.post<AttributeListResult>({ url: AssetApi.AssetAddOrUpdateApi, params });

// 查询全部资产
export const listAssetAll = () =>
  defHttp.get<AssetListResultModel>({ url: AssetApi.AssetListAllApi });

// 查询当前用户全部资产
export const listAssetsOfThreeModels = (params: ModelAssetSearch) =>
  defHttp.post<AssetListItem[]>({ url: AssetApi.AssetsOfThreeModelApi, params})

// 查询全部名称
export const listAssetAllNames = () =>
  defHttp.get<AssetListResultModel>({ url: AssetApi.AssetListAllNamesApi });

// 资产设备名称分页查询
export const listAssetNamesByPager = (params: AssetParams) =>
  defHttp.post<AssetListResultModel>({ url: AssetApi.AssetListAllNamesByPagerApi, params });
