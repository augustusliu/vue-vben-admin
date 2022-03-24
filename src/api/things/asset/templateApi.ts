import { defHttp } from '/@/utils/http/axios';

import {
  TemplateParams,
  TemplateItem,
  AddOrUpdateTemplate,
  TemplateListResult,
} from '/@/api/things/asset/model/templateModel';

enum DeviceTemplateApi {
  TemplateListWithPager = '/api/dtemplate/listWithPager',
  TemplateGet = '/api/dtemplate/get/',
  TemplateDelete = '/api/dtemplate/del/',
  TemplateAddOrUpdate = '/api/dtemplate/addOrUpdate',
}

export const addOrUpdateTemplate = (params: AddOrUpdateTemplate) =>
  defHttp.post<number>({ url: DeviceTemplateApi.TemplateAddOrUpdate, params });

export const listTemplateWithPager = (params: TemplateParams) =>
  defHttp.post<TemplateListResult>({ url: DeviceTemplateApi.TemplateListWithPager, params });

export const getTemplate = (templateId: number) =>
  defHttp.get<TemplateItem>({ url: DeviceTemplateApi.TemplateGet + templateId });

export const delTemplate = (templateId: number) =>
  defHttp.get<number>({ url: DeviceTemplateApi.TemplateDelete + templateId });
