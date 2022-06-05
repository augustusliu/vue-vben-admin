import { defHttp } from '/@/utils/http/axios';
import {
  ModelItem,
  ModelListResultModel,
  modelSearchParams, modelSearchParamsWithoutPager, modelUpdateInfoParams
} from "/@/api/things/baseData/model/threeModel";

enum ModelApi {
  ModelListWithPagerApi = '/api/model/search',
  ModelListApi = '/api/model/list',
  ModelChangeMainOrEnableApi = '/api/model/change',
  ModelDelApi = '/api/model/del',
  ModelUploadAddApi = '/api/model/add',
  ModelGetApi = '/api/model/get',
  ModelUpdateInfoApi = '/api/model/update',

}

export const getModelInfoApi = (modelId: number) =>
  defHttp.get<ModelItem>({ url: ModelApi.ModelGetApi + '?modelId=' + modelId });

export const addModelInfo = (params: any[]) =>
  defHttp.post<void>({ url: ModelApi.ModelUploadAddApi, params });

export const updateModelInfo = (params: modelUpdateInfoParams) =>
  defHttp.post<void>({ url: ModelApi.ModelUpdateInfoApi, params });

export const searchModelByPager = (params: modelSearchParams) =>
  defHttp.post<ModelListResultModel>({ url: ModelApi.ModelListWithPagerApi, params });

export const searchModelList = (params: modelSearchParamsWithoutPager) =>
  defHttp.post<ModelItem[]>({ url: ModelApi.ModelListApi, params });

export const deleteModelApi = (modelId: number) =>
  defHttp.get<number>({ url: ModelApi.ModelDelApi + '?modelId=' + modelId });

export const changeModeMainOrEnableApi = (params: ModelItem) =>
  defHttp.post<number>({ url: ModelApi.ModelChangeMainOrEnableApi , params });

