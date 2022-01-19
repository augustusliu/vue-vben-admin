import { defHttp } from '/@/utils/http/axios';

import {
  AssetParams,
  AssetListResultModel,
} from '/@/api/things/asset/model/assetModel';

enum AssetApi {
  AssetListByPager = '/api/asset/list',
}

// 分页查询对应的资产列表
export const listAssetApi = (params: AssetParams) =>
  defHttp.post<AssetListResultModel>({ url: AssetApi.AssetListByPager, params });
