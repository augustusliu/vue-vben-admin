import {HtmlNodeModel, HtmlNode, ConnectRule} from '@logicflow/core';
import './thingsNode.css'
import {NodeDegree} from "/@/components/FlowChartNode/src/ThingsNodeDegree";
import BaseNodeModel from "@logicflow/core/types/model/node/BaseNodeModel";

class ThingsNodeModel extends HtmlNodeModel {
  setAttributes() {
    this.text.editable = false; // 禁止节点文本编辑
    const width = 110;
    const height = 27;
    this.width = width;
    this.height = height;
    this.text.x = this.text.x + 3;
    this.text.y = this.text.y + 2;
    // 设置连接规则
    this.targetRules = [defaultConnectRule];
    this.sourceRules = [defaultConnectRule];

    const { properties } = this;
    let anchors: any;
    // 如果为空，则默认双向连接
    switch (properties.degreeType) {
      case NodeDegree.In_Degree:
        anchors = [
          [-width / 2, 0],  // 左侧连接点
        ]
        break;
      case NodeDegree.Out_Degree:
        anchors = [
          [width / 2, 0],  // 左侧连接点
        ]
        break;
      default:
        anchors = [
          [width / 2, 0],  // 左侧连接点
          [-width / 2, 0],  // 右侧连接点
        ]
    }
    this.anchorsOffset = anchors;
  }
}

class ThingsNodeNode extends HtmlNode {
  currentProperties: any;
  shouldUpdate() {
    const { properties } = this.getAttributes();
    this.currentProperties = properties;
    return true;
  }
  setHtml(rootEl: HTMLElement) {
    const { properties } = this.getAttributes();
    const style = properties.style;
    if (!this.shouldUpdate()) return;
    const el = document.createElement('div');

    // 设置拖拽后的样式
    el.className = style.className || 'things-node';
    el.style.backgroundColor = style.backgroundColor || '#FFFFFF';
    el.style.opacity = style.opacity || '1';

    // 1、创建图标显示
    const iconContainer = document.createElement('div');
    iconContainer.className = 'things-node-icon';
    if(style.icon){
      const img = document.createElement('img');
      img.src = style.icon;
      iconContainer.appendChild(img);
    }

    // 2、创建文本样式
    const textContainer = document.createElement('span');
    textContainer.className = 'things-node-text';
    textContainer.style.backgroundColor = style.backgroundColor || '#FFF';
    textContainer.style.opacity = style.opacity || '1';

    // 3、添加元素
    el.appendChild(iconContainer);
    el.appendChild(textContainer);
    rootEl.appendChild(el);
  }
}

const defaultConnectRule: ConnectRule = {
  message: '单向节点无法连接',
  validate: (src: BaseNodeModel, target: BaseNodeModel) => {
    if(src.id === target.id){
      return false;
    }
    const srcDegreeType = src.properties.degreeType;
    const targetDegreeType = target.properties.degreeType;
    if(srcDegreeType && NodeDegree.In_Degree === srcDegreeType){
      return false;
    }
    if(targetDegreeType && NodeDegree.Out_Degree === targetDegreeType){
      return false;
    }
    return true;
  }
}


const ThingsNode = {
  type: 'thingsNode',
  view: ThingsNodeNode,
  model: ThingsNodeModel
}
export {
  ThingsNode,
};
