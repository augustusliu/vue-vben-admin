import { HtmlNodeModel, HtmlNode } from '@logicflow/core';
import './thingsNode.css'

class ThingsNodeModel extends HtmlNodeModel {
  setAttributes() {
    this.text.editable = false; // 禁止节点文本编辑
    const width = 120;
    const height = 27;
    this.width = width;
    this.height = height;
    this.anchorsOffset = [
      [width / 2, 0],  // 左侧连接点
      [-width / 2, 0],  // 右侧连接点
    ]
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
    const { properties, text } = this.getAttributes();
    const style = properties.style;
    if (!this.shouldUpdate()) return;
    const el = document.createElement('div');

    // 设置拖拽后的样式
    console.log(this.getAttributes());
    el.className = style.className || 'things-node';
    el.style.backgroundColor = style.backgroundColor || '#FFFFFF';
    el.style.opacity = style.opacity || '1';

    // 1、创建图标显示
    const iconContainer = document.createElement('span');
    iconContainer.className = 'things-node-icon';
    if(style.icon){
      iconContainer.style.backgroundImage = style.icon;
    }

    // 2、创建文本样式
    const textContainer = document.createElement('span');
    textContainer.className = 'things-node-text';
    textContainer.innerText = text.value;
    textContainer.style.backgroundColor = style.backgroundColor || '#FFF';
    textContainer.style.opacity = style.opacity || '1';

    // 3、添加元素
    el.appendChild(iconContainer);
    el.appendChild(textContainer);
    rootEl.appendChild(el);
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
