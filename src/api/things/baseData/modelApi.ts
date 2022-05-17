import { defHttp } from '/@/utils/http/axios';
import {
  ModelItem,
  ModelListResultModel,
  modelSearchParams
} from "/@/api/things/baseData/model/threeModel";

enum ModelApi {
  ModelListWithPagerApi = '/api/model/search',
  ModelListApi = '/api/model/list',
  ModelChangeMainOrEnableApi = '/api/model/change',
  ModelDelApi = '/api/model/del',
  ModelUploadAddApi = '/api/model/add',
}

export const addModelInfo = (params: any[]) =>
  defHttp.post<void>({ url: ModelApi.ModelUploadAddApi, params });

export const searchModelByPager = (params: modelSearchParams) =>
  defHttp.post<ModelListResultModel>({ url: ModelApi.ModelListWithPagerApi, params });

export const searchModelList = (params: modelSearchParams) =>
  defHttp.post<ModelListResultModel>({ url: ModelApi.ModelListApi, params });

export const deleteModelApi = (modelId: number) =>
  defHttp.get<number>({ url: ModelApi.ModelDelApi + '?modelId=' + modelId });

export const changeModeMainOrEnableApi = (params: ModelItem) =>
  defHttp.post<number>({ url: ModelApi.ModelChangeMainOrEnableApi , params });

