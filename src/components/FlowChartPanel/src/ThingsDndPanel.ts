import LogicFlow from '@logicflow/core';
import './thingsdnd.css'

declare type ShapeItem = {
  id?: string;
  type?: string;
  text?: string;
  icon?: string;
  className?: string;
  bgColor?: string,
  properties?: Record<string, any>;
  callback?: string;
};

declare type ShapeGroup = {
  id?: string;
  group?: string;
  bgColor?: string,
  groupName?: string;
  items?: ShapeItem[];
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
    // @ts-ignore
    if (!this.groupList || this.groupList.length === 0 || this.groupList == 'undefined' ) return;
    this.panelEl = document.createElement('div');
    this.panelEl.className = 'lf-dndpanel-things';

    this.groupList.forEach(group => {
      this.panelEl?.appendChild(this.createDndGroup(group));
    });
    domContainer.appendChild(this.panelEl);
  }

  private createDndGroup(shapeGroup: ShapeGroup) : HTMLElement{
    const el = document.createElement('details');
    el.className ='dntMenu';
    el.open = true;
    if (shapeGroup.id != null && shapeGroup.id != 'undefined') {
      el.id = shapeGroup.id;
    }

    const summary = document.createElement('summary');
    if (shapeGroup.groupName != null && shapeGroup.groupName != 'undefined') {
      summary.innerText = shapeGroup.groupName;
    }
    summary.style.backgroundColor = shapeGroup.bgColor ? shapeGroup.bgColor : '#f1f1f1';

    el.appendChild(summary);

    // 创建子项菜单
    const ul = document.createElement('ul');

    if(shapeGroup.items != null && shapeGroup.items.length > 0){
      shapeGroup.items.forEach(item => {
        const li = document.createElement('li');
        li.appendChild(this.createDndItem(item));
        ul.appendChild(li);
      });
    }
    el.appendChild(ul);
    return el;
  }

  private createDndItem(shapeItem: any) : HTMLElement{
    // 创建面板中的子元素
    const el = document.createElement('div');
    el.className = shapeItem.className ? `lf-dnd-things-item ${shapeItem.className}` : 'lf-dnd-things-item';
    if (shapeItem.id != null && shapeItem.id != 'undefined') {
      el.id = shapeItem.id;
    }

    el.style.backgroundColor = shapeItem.bgColor ? shapeItem.bgColor : '#FFFFFF';

    // 1、创建item图标
    const iconItem = document.createElement('span');
    iconItem.className = 'lf-dnd-things-item-icon';
    if (shapeItem.icon) {
      iconItem.style.backgroundImage = `url(${shapeItem.icon})`;
    }
    el.appendChild(iconItem);

    // 2、创建item文字
    if (shapeItem.label) {
      const text = document.createElement('span');
      text.innerText = shapeItem.label;
      text.className = 'lf-dnd-things-item-text';
      el.appendChild(text);
    }
    if(shapeItem.properties == null || shapeItem.properties == '' || shapeItem.properties == 'undefined'){
      shapeItem.properties = {}
    }
    shapeItem.properties['icon'] = shapeItem.icon;
    shapeItem.properties['label'] = shapeItem.label;
    shapeItem.properties['bgColor'] = shapeItem.bgColor;

    // 绑定鼠标拖拽事件
    el.onmousedown = () => {
      if (shapeItem.type) {
        this.lf.dnd.startDrag({
          id: shapeItem.id,
          type: shapeItem.type,
          properties: shapeItem.properties,
          text: shapeItem.text,
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
