import { defHttp } from '/@/utils/http/axios';

import {
  RuleSearchParams,
  RuleChainListItem,
  RuleChainListResultModel
} from '/@/api/things/ruler/model/ruleChainModel';

import {
  RuleNodeGroupResult
} from '/@/api/things/ruler/model/ruleNodeModel';


enum RulerApi {

  // 获取当前用户的规则链列表
  RuleChainListApi = '/api/chains/list',
  RuleChainTemplateMenuApi = '/api/chains/template',
  RuleChainSaveOrUpdateApi = '/api/chains/saveOrUpdate',
  RuleChainDeleteApi = '/api/chains/del',
  RuleChainInfoApi = '/api/chains/info',

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

// 保存或者更新
export const saveChainApi = (params: any) =>
  defHttp.post<number>({ url: RulerApi.RuleChainSaveOrUpdateApi, params});

export const deleteApi = (id: number) =>
  defHttp.get<number>({ url: RulerApi.RuleChainDeleteApi + "?chainId=" + id});

// 规则链全量信息
export const chainInfoApi = (id: number) =>
  defHttp.get<number>({ url: RulerApi.RuleChainInfoApi + "?chainId=" + id});


// 获取所有左侧节点列表
export const listAllLeftNodesApi = () =>
  defHttp.get<RuleNodeGroupResult>({ url: RulerApi.NodeListApi});

// 获取一条规则链的详细信息
export const getRuleChainApi = () =>
  defHttp.get<RuleChainListItem>({ url: RulerApi.RuleChainGetApi});
