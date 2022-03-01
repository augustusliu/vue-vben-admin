import LogicFlow from '@logicflow/core';
import './thingsdnd.css'

// 左侧元素
declare type ShapeItem = {
  id?: string;  // 节点id
  type?: string;  // 节点类型
  name?: string;  // 节点名称
  properties?: Record<string, any>;
  callback?: string;
};

// 元素分组
declare type ShapeGroup = {
  id?: string;
  name?: string;
  properties?: any;
  nodes?: ShapeItem[];
};

class ThingsDndPanel{
  lf: LogicFlow;
  groupList?: ShapeGroup[];
  panelEl?: HTMLDivElement;
  static pluginName = 'ThingsDndPanel';
  constructor({lf}) {
    this.lf = lf;
    this.lf.setPatternItems = (groupList) => {
      this.groupList = groupList;
    };
  }
  render(lf, domContainer: HTMLDivElement) {
    if (this.panelEl) {
      domContainer.removeChild(this.panelEl);
    }
    if (!this.groupList || this.groupList.length <= 0) return;
    // 左侧菜单容器
    this.panelEl = document.createElement('div');
    this.panelEl.className = 'lf-dndpanel-things';

    // 遍历创建分组
    this.groupList.forEach(group => {
      this.panelEl?.appendChild(this.createDndGroup(group));
    });
    domContainer.appendChild(this.panelEl);
  }

  private createDndGroup(shapeGroup: ShapeGroup) : HTMLElement{
    const groupItem = document.createElement('details');
    groupItem.className ='dntMenu';
    groupItem.open = true;
    if (shapeGroup.id) {
      groupItem.id = shapeGroup.id;
    }

    const summary = document.createElement('summary');
    if (shapeGroup.name) {
      summary.innerText = shapeGroup.name;
    }
    // 获取分组显示的配置信息
    const { properties, nodes } = shapeGroup;
    const { style } = properties;

    summary.style.backgroundColor = style.backgroundColor || '#f1f1f1';
    summary.style.opacity = style.opacity || '1';
    summary.style.color = style.color || '#888888';
    groupItem.appendChild(summary);
    if(!nodes || nodes.length <= 0){
      return groupItem;
    }

    // 创建子项菜单
    const childUl = document.createElement('ul');
    nodes.forEach(item => {
      const li = document.createElement('li');
      li.appendChild(this.createDndItem(item));
      childUl.appendChild(li);
    });
    groupItem.appendChild(childUl);
    return groupItem;
  }

  // 创建具体对应的节点
  private createDndItem(shapeItem: any) : HTMLElement{
    // 创建面板中的子元素
    const el = document.createElement('div');
    const { properties } = shapeItem;
    const { style } = properties;
    el.className = 'lf-dnd-things-item'
    el.style.backgroundColor = '#FFFFFF';
    el.id = shapeItem.id;

    // 1、创建item图标
    const iconItem = document.createElement('span');
    iconItem.className = 'lf-dnd-things-item-icon';
    if (properties?.icon) {
      iconItem.style.backgroundImage = `url(${style.icon})`;
    }
    el.appendChild(iconItem);

    // 2、创建item文字
    if (shapeItem.name) {
      const text = document.createElement('span');
      el.style.backgroundColor = style.backgroundColor || '#FFFFFF';
      el.style.opacity = style.opacity || '1';
      text.innerText = shapeItem.name;
      text.className = 'lf-dnd-things-item-text';
      el.appendChild(text);
    }

    // 绑定鼠标拖拽事件
    el.onmousedown = () => {
      if (shapeItem.type) {
        this.lf.dnd.startDrag({
          type: shapeItem.type,
          properties: shapeItem.properties,
          text: shapeItem.name,
        });
      }
      if (shapeItem.callback) {
        shapeItem.callback();
      }
    };
    return el;
  }
}

export {
  ThingsDndPanel,
};
