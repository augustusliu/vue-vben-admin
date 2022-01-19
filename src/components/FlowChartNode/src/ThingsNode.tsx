import { HtmlNodeModel, HtmlNode } from '@logicflow/core';
import './thingsNode.css'

class ThingsNodeModel extends HtmlNodeModel {
  setAttributes() {
    this.text.editable = false; // 禁止节点文本编辑
    // 设置节点宽高和锚点
    const width = 120;
    const height = 27;
    this.width = width;
    this.height = height;
    this.anchorsOffset = [
      [width / 2, 0],
      [0, height / 2],
      [-width / 2, 0],
      [0, -height/2],
    ]
  }
}

class ThingsNodeNode extends HtmlNode {
  currrentProperties: string;
  shouldUpdate() {
    const { properties } = this.getAttributes();
    if (this.currrentProperties && this.currrentProperties === JSON.stringify(properties)) return false;
    this.currrentProperties = JSON.stringify(properties)
    return true;
  }
  setHtml(rootEl: HTMLElement) {
    const { properties } = this.getAttributes();
    if (!this.shouldUpdate()) return;
    const el = document.createElement('div');
    el.className = 'things-node';
    el.style.backgroundColor = properties.bgColor ? properties.bgColor : '#FFFFFF';
    let iconSpan = ``;
    if(properties.icon == null || properties.icon == '' || properties.icon == 'undefined'){
      iconSpan = '<span class="things-node-icon" > </span>'
    }else{
      iconSpan = `<span class="things-node-icon" > ${properties.icon} </span>`;
    }

    let html = iconSpan + `
        <span class="things-node-text"> ${properties.label} </span>
    `;
    el.innerHTML = html;
    // 需要先把之前渲染的子节点清除掉。
    rootEl.innerHTML = '';
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
