
//定义节点是否可以出入方向
export enum NodeDegree{
  // 节点只能接收数据
  In_Degree= 'IN',
  // 节点只能发送数据
  Out_Degree ='OUT',
  // 节点既可以接收数据，也可以发送数据
  Full_Degree = 'INOUT',
}
