
// 节点的分组信息
export interface RuleNodeGroupItem {
  group: string;
  groupName: string;
  bgColor: string;
  items: RuleNodeDefinition[];
}

// 节点的定义信息
export interface RuleNodeDefinition {
  id: string;
  type: string;
  label: string;
  bgColor: string;
  chainId: string;
  description: string;
  x: string;
  y: string;
  configuration: ConfigAttribute[];
  clazz: string;
  nodeId: string;
}

// 属性配置
export interface ConfigAttribute {
  name: string;
  code: string;
  type: string;
  value: string;
  description: string;
}
export type RuleNodeGroupResult = RuleNodeGroupItem[];
