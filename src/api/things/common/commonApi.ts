import { defHttp } from '/@/utils/http/axios';
const globSetting = useGlobSetting();
import {
  AreasResult,
  IndustryResult
} from "/@/api/things/common/model/commonModel";
import {UploadFileParams} from "/#/axios";
import {UploadApiResult} from "/@/api/sys/model/uploadModel";
import {useGlobSetting} from "/@/hooks/setting";

enum CommonApi {
  // 获取全部地区信息
  AreaListAll = '/api/area/listAll',
  AreaListAllByParent = '/api/area/listByParent/',
  IndustryListAll = '/api/industry/listAll',
  IndustryListByParent = '/api/industry/listByParent/',

  FileModelUploadApi ='/api/file/model/upload',
  GetModelApi = '/api/file/model/get/',
  FileImageUploadApi = '/api/file/img/upload',
  GetImageApi = '/api/file/img/get/',
}

export const listAreas = () =>
  defHttp.get<AreasResult>({ url: CommonApi.AreaListAll });
export const listAreasByParent = (parentCode: string) =>
  defHttp.get<AreasResult>({ url: CommonApi.AreaListAllByParent + parentCode });

export const listIndustryAll = () =>
  defHttp.get<IndustryResult>({ url: CommonApi.IndustryListAll });
export const listIndustryByParent = (parentCode: string) =>
  defHttp.get<IndustryResult>({ url: CommonApi.IndustryListByParent + parentCode });


export function uploadModelApi(params: UploadFileParams, onUploadProgress: (progressEvent: ProgressEvent) => void) {
  return defHttp.uploadFile<UploadApiResult>(
    {
      url: globSetting.apiUrl + CommonApi.FileModelUploadApi,
      timeout: 30 * 10000,
      timeoutErrorMessage: '文件上传超时',
      onUploadProgress,
    },
    params
  );
}

export const uploadImageApi = (params: any) =>
  defHttp.post<String>({ url: globSetting.apiUrl + CommonApi.FileImageUploadApi , params });

export const getModelApi = (fileId: any) =>
  defHttp.get<any>({ url: CommonApi.GetModelApi  + fileId });
export const getImageApi = (fileId: any) =>
  defHttp.get<any>({ url: CommonApi.GetImageApi  + fileId });
