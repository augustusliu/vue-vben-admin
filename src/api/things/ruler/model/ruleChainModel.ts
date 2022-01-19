import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

export type RuleSearchParams = BasicPageParams & {
  // 规则链名称
  ruleChainName?: string;
  // 规则链是否有效
  active?: boolean;
};

// 规则链列表的展示信息
export interface RuleChainListItem {
  id: string;
  ruleChainName: string;
  active: boolean;
  createdTime: string;
  modifiedTime: string;
  ruleChainInfo: RuleChainInfo;
}

export interface RuleChainInfo {
  nodes: RuleChainNode[];
  edges: RuleChainNodeRelation[];
}

// 规则链中某个节点的信息
export interface RuleChainNode {
  id: string;
  type: string;
  label: string;
  bgColor: string;
  chainId: string;
  description: string;
  x: string;
  y: string;
  configuration: string;
  clazz: string;
  nodeId: string;
}

// 规则链中节点的关系
export interface RuleChainNodeRelation {
  id: string;
  type: string;
  sourceNodeId: string;
  targetNodeId: string;
  startPoint: RuleChainNodePoint;
  endPoint: RuleChainNodePoint;
  pointsList: RuleChainNodePoint[];
}

// 规则链中节点的坐标
export interface RuleChainNodePoint {
  x: string;
  y: string;
}


export type RuleChainListResultModel = BasicFetchResult<RuleChainListItem>;





