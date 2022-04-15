import { defHttp } from '/@/utils/http/axios';
import {useGlobSetting} from "/@/hooks/setting";
import {getToken} from "/@/utils/auth";
import {
  CommandSearchParam,
  CommandListResult,
  AddOrUpdateCommandParam, CommandListItem
} from "/@/api/things/command/model/commandModel";

const globSetting = useGlobSetting();

enum CommandApi {
  // 分页获取实体属性列表
  CommandListPagerApi = '/api/command/listWithPager',
  // 更新或者添加实体某个属性
  CommandAddOrUpdate = '/api/command/addOrUpdate',
  CommandDel = '/api/command/del/',
  CommandListAllApi = '/api/command/list',


  CommandTelemetryListWithPager = '/api/command/telemetry',
  CommandTelemetryWsApi = '/api/ws/telemetry',
}

export const listCommand = (params: CommandSearchParam) =>
  defHttp.post<CommandListResult>({ url: CommandApi.CommandListPagerApi , params });

export const listAllCommand = (params: CommandSearchParam) =>{
  if(params.entityId){
    return defHttp.post<CommandListItem[]>({ url: CommandApi.CommandListAllApi , params });
  }else{
    return new Promise<CommandListItem[]>(function (resolve) {
        resolve([]);
    })
  }
}


export const addOrUpdateCommand = (params: AddOrUpdateCommandParam) =>
  defHttp.post<number>({ url: CommandApi.CommandAddOrUpdate , params });

export const delCommand = (commandId: number) =>
  defHttp.get<number>({ url: CommandApi.CommandDel + commandId });

// 获取遥测指令
export const telemetryCommandApi = (params: CommandSearchParam) =>
  defHttp.post<CommandListResult>({ url: CommandApi.CommandTelemetryListWithPager , params });

export const getCommandTelemetryWsApi = (entityId: number) => {
  return globSetting.wsUrl + CommandApi.CommandTelemetryWsApi +"?subTopic=deviceCommandTelemetry&deviceId=" + entityId +"&token=" + getToken()}

