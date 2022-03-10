import {
  RuleChainNode,
  RuleChainNodeRelation,
} from "/@/api/things/ruler/model/ruleChainModel";

/**
 * 规则数据转换为可以接受的数据格式
 * @param input        规则链数据
 */
export const formatGraphData = (input: any) => {

  const params: any = {
     id: (input.chainId && Number(input.chainId) > 0) ? input.chainId : null,
     ruleChainName: input.chainName,
     active: input.active,
     description: input.description
   };

   const { nodes, edges } = input.data;

   if(!nodes || nodes.length <= 0){
     return ;
   }

  if(!edges || edges.length <= 0){
    return ;
  }
   const unionNodes: RuleChainNode[] = [];
   nodes.forEach(item => unionNodes.push({
     id: item.properties.fixId,
     clazz: item.properties.clazz,
     dynamicId: item.id,
     fixId: item.properties.fixId,
     type: item.type,
     ruleChainId: input.chainId,
     properties: item.properties,
     text: item.text,
     x: item.x,
     y: item.y
   }));

  // 清空边的id
  const unionEdges: RuleChainNodeRelation[] = [];
  edges.forEach(item => unionEdges.push({
    type: item.type,
    sourceNodeId: item.sourceNodeId,
    targetNodeId: item.targetNodeId,
    startPoint: item.startPoint,
    endPoint: item.endPoint,
    pointsList: item.pointsList,
    text: item.text,
    properties: item.properties,
  }));

  params.nodes = unionNodes;
  params.edges = unionEdges;
  return params;
}
