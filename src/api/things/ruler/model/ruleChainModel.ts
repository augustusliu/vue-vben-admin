import { BasicPageParams, BasicFetchResult } from '/@/api/model/baseModel';

// 规则链搜索
export type ChainSearchParams = BasicPageParams & {
  ruleChainName?: string;
  active?: boolean;
};

export type RuleSearchParams = BasicPageParams & {
  // 规则链名称
  ruleChainName?: string;
  // 规则链是否有效
  active?: boolean;
};

// 规则链列表的展示信息
export interface RuleChainListItem {
  id: number;
  ruleChainName: string;
  active: boolean;
  description: string;
  createdTime: string;
  modifiedTime: string;
}

// 用于保存规则链
export interface RuleChainSaveParams {
  id: number;
  ruleChainName: string;
  active: boolean;
  description: string;
  nodes: RuleChainNode[];
  edges: RuleChainNodeRelation[];
}

// 规则链中某个节点的信息
export interface RuleChainNode {
  id: number;
  dynamicId: string;
  ruleChainId: number;
  fixId: number;
  x: string;
  y: string;
  text: RuleCommonText;
  clazz: string;
  properties: any;
  type: string;
}

// 规则链中节点的关系
export interface RuleChainNodeRelation {
  id?: number;
  type: string;
  sourceNodeId: string;
  targetNodeId: string;
  startPoint: RuleChainNodePoint;
  endPoint: RuleChainNodePoint;
  pointsList: RuleChainNodePoint[];
  text: RuleCommonText;
  properties: any;
}


// 规则链中节点的坐标
export interface RuleChainNodePoint {
  x: string;
  y: string;
}
export type RuleCommonText = RuleChainNodePoint & {
  value: string;
}




export type RuleChainListResultModel = BasicFetchResult<RuleChainListItem>;





