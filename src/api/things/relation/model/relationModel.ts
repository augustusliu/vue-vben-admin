import {BasicPageParams} from "/@/api/model/baseModel";


export type RelationAtlasSearchParam = BasicPageParams & {
  // ?表示参数是可选项，可能存在，可能不存在
  entityId?: number;
  entityType?: string;
  searchTypes?: string[];
};

// 关系图谱节点定义
export interface RelationNode {
  id: number;
  name: string;
  code: string;
  label: string;
  entityType: string;
}

// 关系图谱边定义
export interface RelationEdge {
  id: number;
  relationType: string;
  fromEntityType: string;
  fromEntityId: number;
  toEntityType: string;
  toEntityId: string;
  additionalInfo: RelationEdgeExtendItem[];
}

// 关系图谱边的扩展信息定义
export interface RelationEdgeExtendItem {
  code: string;
  name: string;
  value: string;
}

// 关系图谱数据接口
export interface RelationAtlasModel {
  nodes: RelationNode[];
  edges: RelationEdge[];
}


