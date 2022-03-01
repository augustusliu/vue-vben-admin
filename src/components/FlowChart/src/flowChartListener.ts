import LogicFlow from "@logicflow/core";

// 处理绑定事件
export const bindListener = (lf: LogicFlow) => {
  if(!lf) return; // 如果为空则返回

  // 双击节点查看配置页面
  lf.on('node:dbclick', ( data ) => {
    console.log(data);
  })

  // 双击边查看配置页面
  lf.on('edge:dbclick', ( data ) => {
    console.log(data);
  })
}



