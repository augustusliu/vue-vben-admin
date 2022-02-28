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

  // 获取左侧节点列表
  NodeListApi = '/api/chains/rule/node/list',

  // 一条规则链的详细信息
  RuleChainGetApi = '/api/rule/chain/info',
  // 一条规则链中某个节点的配置信息
  RuleChainNodeApi = '/api/rule/chain/node',

  RuleChainSaveOrUpdateApi = '/rule/chain/saveOrUpdate',
}

// 获取所有规则链
export const listAllRuleChainApi = (params: RuleSearchParams) =>
  defHttp.post<RuleChainListResultModel>({ url: RulerApi.RuleChainListApi, params});

// 获取所有左侧节点列表
export const listAllLeftNodesApi = () =>
  defHttp.get<RuleNodeGroupResult>({ url: RulerApi.NodeListApi});

// 获取一条规则链的详细信息
export const getRuleChainApi = () =>
  defHttp.get<RuleChainListItem>({ url: RulerApi.RuleChainGetApi});
