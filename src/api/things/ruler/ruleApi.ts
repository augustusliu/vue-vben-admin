import { defHttp } from '/@/utils/http/axios';

import {
  RuleChainListItem,
  RuleChainListResultModel
} from '/@/api/things/ruler/model/ruleChainModel';

import {
  RuleNodeGroupResult
} from '/@/api/things/ruler/model/ruleNodeModel';


enum RulerApi {
  // 获取左侧节点列表
  NodeListApi = '/api/rule/node/list',
  // 获取当前用户的规则链列表
  RuleChainListApi = '/api/rule/chain/list',
  // 一条规则链的详细信息
  RuleChainGetApi = '/api/rule/chain/info',
  // 一条规则链中某个节点的配置信息
  RuleChainNodeApi = '/api/rule/chain/node',

  RuleChainSaveOrUpdateApi = '/rule/chain/saveOrUpdate',
}

// 获取所有左侧节点列表
export const listAllLeftNodesApi = () =>
  defHttp.get<RuleNodeGroupResult>({ url: RulerApi.NodeListApi});

// 获取所有规则链
export const listAllRuleChainApi = () =>
  defHttp.get<RuleChainListResultModel>({ url: RulerApi.RuleChainListApi});
// 获取一条规则链的详细信息
export const getRuleChainApi = () =>
  defHttp.get<RuleChainListItem>({ url: RulerApi.RuleChainGetApi});
