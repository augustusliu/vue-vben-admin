import { defHttp } from '/@/utils/http/axios';

import {
  AssetParams,
  AssetAddParam,
  AssetListItem,
  AssetListResultModel,
} from '/@/api/things/asset/model/assetModel';

import {
  AttributeListResult,
  AddOrUpdateAttributeParam,
} from '/@/api/things/asset/model/attributeModel';

enum AssetApi {
  // 资产列表信息
  AssetListByPager = '/api/asset/list',
  // 资产详情信息
  AssetGet = '/api/asset/get/',
  // 资产下分页属性列表
  AssetAttributeList = '/api/asset/attr/listWithPager',
  // 为资产添加一个属性信息
  AssetAddOneAttribute = '/api/asset/attr/one/',
  // 添加编辑资产
  AssetAddOrUpdateApi = '/api/asset/addOrUpdate',
}

// 分页查询对应的资产列表
export const listAssetApi = (params: AssetParams) =>
  defHttp.post<AssetListResultModel>({ url: AssetApi.AssetListByPager, params });

// 分页查询对应的资产列表
export const getAssetApi = (params: number) =>
  defHttp.get<AssetListItem>({ url: AssetApi.AssetGet + params });

// 查询资产下属性列表
export const listAttributeByAssetApi = (params: any) =>
  defHttp.post<AttributeListResult>({ url: AssetApi.AssetAttributeList , params });

// 为资产添加一个属性
export const addOneAttributeApi = (_assetId:number, params: AddOrUpdateAttributeParam) =>
  defHttp.post<AttributeListResult>({ url: AssetApi.AssetAddOneAttribute + _assetId, params });

// 添加编辑资产
export const addOrUpdateAsset = (params: AssetAddParam) =>
  defHttp.post<AttributeListResult>({ url: AssetApi.AssetAddOrUpdateApi , params });
