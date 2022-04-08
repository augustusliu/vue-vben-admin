import { defHttp } from '/@/utils/http/axios';
import { getToken } from '/@/utils/auth';

const globSetting = useGlobSetting();

import {
  RuleSearchParams,
  RuleChainListItem,
  RuleChainListResultModel
} from '/@/api/things/ruler/model/ruleChainModel';

import {
  RuleNodeGroupResult
} from '/@/api/things/ruler/model/ruleNodeModel';
import {useGlobSetting} from "/@/hooks/setting";


enum RulerApi {

  // 获取当前用户的规则链列表
  RuleChainListApi = '/api/chains/list',
  RuleChainTemplateMenuApi = '/api/chains/template',
  RuleChainSaveOrUpdateApi = '/api/chains/saveOrUpdate',
  RuleChainDeleteApi = '/api/chains/del',
  RuleChainInfoApi = '/api/chains/info',
  RuleChainDebugChangeApi = '/api/chains/debug',
  RuleChainStopApi = '/api/chains/stop/',

  RuleChainDebugWsApi = '/api/ws/telemetry',
  // ---- old
  // 获取左侧节点列表
  NodeListApi = '/api/chains/rule/node/list',
  // 一条规则链的详细信息
  RuleChainGetApi = '/api/rule/chain/info',
  // 一条规则链中某个节点的配置信息
  RuleChainNodeApi = '/api/rule/chain/node',

}

// 获取所有规则链
export const listAllRuleChainApi = (params: RuleSearchParams) =>
  defHttp.post<RuleChainListResultModel>({ url: RulerApi.RuleChainListApi, params});

export const getNodeTemplateMenuApi = () =>
  defHttp.get<RuleNodeGroupResult>({ url: RulerApi.RuleChainTemplateMenuApi});

// 获取一条完整的规则链
export const chainInfoApi = (chainId: number) =>
  defHttp.get<RuleChainListItem>({ url: RulerApi.RuleChainInfoApi +"?chainId= " + chainId});

// 保存或者更新
export const saveChainApi = (params: any) =>
  defHttp.post<number>({ url: RulerApi.RuleChainSaveOrUpdateApi, params});

export const deleteApi = (id: number) =>
  defHttp.get<number>({ url: RulerApi.RuleChainDeleteApi + "?chainId=" + id});

// 规则链开启关闭调试信息
export const debugChangeApi = (ruleChainId: number, debugStatus: boolean) =>
  defHttp.get<number>({ url: RulerApi.RuleChainDebugChangeApi + "?ruleChainId=" + ruleChainId + "&debugStatus=" + debugStatus});

// 停止规则链
export const stopChangeApi = (ruleChainId: number) =>
  defHttp.get<number>({ url: RulerApi.RuleChainStopApi + ruleChainId});

// 获取一条规则链的详细信息
export const getRuleChainApi = () =>
  defHttp.get<RuleChainListItem>({ url: RulerApi.RuleChainGetApi});

// 获取所有左侧节点列表
export const listAllLeftNodesApi = () =>
  defHttp.get<RuleNodeGroupResult>({ url: RulerApi.NodeListApi});

// 获取ws 监听规则链的地址
export const getRuleDebugInfoWsApi = (ruleChainId: number, ) => {
  return globSetting.wsUrl + RulerApi.RuleChainDebugWsApi +"?subTopic=ruleDebugInfo&ruleChainId=" + ruleChainId +"&token=" + getToken()}

