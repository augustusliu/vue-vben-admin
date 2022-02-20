import G6 from '@antv/g6';
import { isArray, isNumber } from '/@/utils/is';

// 默认背景色
const defaultDarkBack = 'rgb(43, 47, 51)';
// 节点无效时的颜色
const disableColor = '#777';
// 主题颜色
const defaultTheme = 'dark';
// 主题颜色集合
const subjectColors = [
  '#5F95FF', // blue
  '#61DDAA',
  '#65789B',
  '#F6BD16',
  '#7262FD',
  '#78D3F8',
  '#9661BC',
  '#F6903D',
  '#008685',
  '#F08BB4',
];
// 椭圆节点的颜色集合
const defaultColorSets = G6.Util.getColorSetsBySubjectColors(
  subjectColors,
  defaultDarkBack,
  defaultTheme,
  disableColor
);

// 采用g6，绘制椭圆节点的定义的定义
export const ellipseNodeDefinition = {
  // 椭圆节点的绘制方法，并返回椭圆节点的外围边框样式
  draw(config: any, group: any) {
    // 椭圆的宽，高
    let width = 53,
      height = 27;

    // 配置中的节点样式、颜色的并集
    const style = config.style || {};
    const nodeColorSets = config.colorSet || defaultColorSets[0];
    // 椭圆节点，鼠标悬浮后，添加光圈效果
    group.addShape('rect', {
      attrs: {
        x: -width * 0.55,
        y: -height * 0.6,
        width: width * 1.1,
        height: height * 1.2,
        fill: nodeColorSets.mainFill, // 这个需要针对每个节点，定义其自身的颜色
        opacity: 0.9,
        lineWidth: 0,
        radius: (height / 2 || 13) * 1.2,
      },
      name: 'halo-shape',
      visible: false,
    });
    // 椭圆节点获得焦点后的光圈效果
    group.addShape('rect', {
      attrs: {
        x: -width * 0.55,
        y: -height * 0.6,
        width: width * 1.1,
        height: height * 1.2,
        fill: nodeColorSets.mainFill, // '#3B4043',
        stroke: '#AAB7C4', // 当获得光标焦点后，椭圆边的颜色
        lineWidth: 1,
        lineOpacity: 0.85,
        radius: (height / 2 || 13) * 1.2,
      },
      name: 'stroke-shape',
      visible: false,
    });
    // 椭圆节点外围边框，采用虚线勾勒的样式
    const nodeOutlineShape = group.addShape('rect', {
      attrs: {
        ...style,
        x: -width / 2,
        y: -height / 2,
        width,
        height,
        fill: nodeColorSets.mainFill, // || '#3B4043',
        stroke: nodeColorSets.mainStroke, // 虚线的颜色，这里采用传递进来的随机颜色
        lineWidth: 2, //虚线的宽度
        cursor: 'pointer',
        radius: height / 2 || 13,
        lineDash: [2, 2],
      },
      name: 'aggregated-node-keyShape',
    });
    // 获取椭圆节点的文字描述
    let labelStyle = {};
    if (config.labelCfg) {
      labelStyle = Object.assign(labelStyle, config.labelCfg.style);
    }
    // 为椭圆节点添加文字标签
    group.addShape('text', {
      attrs: {
        text: `${config.count}`, // 节点的文字采用参数传递进来
        x: 0,
        y: 0,
        textAlign: 'center',
        textBaseline: 'middle',
        cursor: 'pointer',
        fontSize: 12,
        fill: '#fff',
        opacity: 0.85,
        fontWeight: 400,
      },
      name: 'count-shape',
      className: 'count-shape',
      draggable: true,
    });
    // tag for new node
    if (config.new) {
      group.addShape('circle', {
        attrs: {
          x: width / 2 - 3,
          y: -height / 2 + 3,
          r: 4,
          fill: '#6DD400',
          lineWidth: 0.5,
          stroke: '#FFFFFF',
        },
        name: 'typeNode-tag-circle',
      });
    }

    return nodeOutlineShape;
  },

  /**
   * 椭圆节点的状态样式控制
   * @param name: 当前节点状态名称
   * @param value: 当前节点的值(或者节点的标签)
   * @param item: 当前节点
   */
  setState: (name: any, value: any, item: any) => {
    // 获取该节点的分组信息
    const group = item.get('group');

    // 如果当前节点状态为绘制完成，且当前节点的值不为空，则设置节点标签，并设置节点可见
    if (name === 'layoutEnd' && value) {
      const labelShape = group.find((e) => e.get('name') === 'text-shape');
      if (labelShape) labelShape.set('visible', true);

      // 如果当前节点是处于鼠标悬浮状态
    } else if (name === 'hover') {
      // 如果已经获得光标，则返回。因为只显示获得光标后的样式
      if (item.hasState('focus')) {
        return;
      }
      const halo = group.find((e) => e.get('name') === 'halo-shape');
      const keyShape = item.getKeyShape();
      const colorSet = item.getModel().colorSet || defaultColorSets[0];
      if (value) {
        halo && halo.show();
        keyShape.attr('fill', colorSet.activeFill);
      } else {
        halo && halo.hide();
        keyShape.attr('fill', colorSet.mainFill);
      }
    } else if (name === 'focus') {
      const stroke = group.find((e) => e.get('name') === 'stroke-shape');
      const keyShape = item.getKeyShape();
      const colorSet = item.getModel().colorSet || defaultColorSets[0];
      if (value) {
        stroke && stroke.show();
        keyShape.attr('fill', colorSet.selectedFill);
      } else {
        stroke && stroke.hide();
        keyShape.attr('fill', colorSet.mainFill);
      }
    }
  },

  update: undefined,
};

// 采用G6，绘制圆形节点的定义
export const circleNodeDefinition = {
  draw(config: any, group: any) {
    // 定义圆形节点的半径
    let r = 30;
    if (isNumber(config.size)) {
      r = config.size / 2;
    } else if (isArray(config.size)) {
      r = config.size[0] / 2;
    }
    const style = config.style || {};
    const colorSet = config.colorSet || defaultColorSets[0];

    // 圆形节点鼠标悬浮后边框样式
    group.addShape('circle', {
      attrs: {
        x: 0,
        y: 0,
        r: r + 5,
        fill: style.fill || colorSet.mainFill || '#2B384E',
        opacity: 0.9,
        lineWidth: 0,
      },
      name: 'halo-shape',
      visible: false,
    });

    // 原型节点鼠标点击获得光标焦点后的样式
    group.addShape('circle', {
      attrs: {
        x: 0,
        y: 0,
        r: r + 5,
        fill: style.fill || colorSet.mainFill || '#2B384E',
        stroke: '#fff', //获得焦点后边框为白色
        strokeOpacity: 0.85,
        lineWidth: 1,
      },
      name: 'stroke-shape',
      visible: false,
    });

    // 原型节点边框的颜色及边框宽度设置
    const keyShape = group.addShape('circle', {
      attrs: {
        ...style,
        x: 0,
        y: 0,
        r,
        fill: colorSet.mainFill,
        stroke: colorSet.mainStroke,
        lineWidth: 2,
        cursor: 'pointer',
      },
      name: 'aggregated-node-keyShape',
    });

    // 原型节点的文本样式
    let labelStyle = {};
    if (config.labelCfg) {
      labelStyle = Object.assign(labelStyle, config.labelCfg.style);
    }

    // 原型节点的文本内容绘制
    if (config.label) {
      const text = config.label;
      let labelStyle: any = {};
      let refY = 0;
      if (config.labelCfg) {
        labelStyle = Object.assign(labelStyle, config.labelCfg.style);
        refY += config.labelCfg.refY || 0;
      }
      let offsetY = 0;
      const fontSize = labelStyle.fontSize < 8 ? 8 : labelStyle.fontSize;
      const lineNum = config.labelLineNum || 1;
      offsetY = lineNum * (fontSize || 12);
      group.addShape('text', {
        attrs: {
          text,
          x: 0,
          y: r + refY + offsetY + 5,
          textAlign: 'center',
          textBaseLine: 'alphabetic',
          cursor: 'pointer',
          fontSize,
          fill: '#fff',
          opacity: 0.85,
          fontWeight: 400,
          stroke: global.edge.labelCfg.style.stroke,
        },
        name: 'text-shape',
        className: 'text-shape',
      });
    }

    if (config.new) {
      group.addShape('circle', {
        attrs: {
          x: r - 3,
          y: -r + 3,
          r: 4,
          fill: '#6DD400',
          lineWidth: 0.5,
          stroke: '#FFFFFF',
        },
        name: 'typeNode-tag-circle',
      });
    }

    return keyShape;
  },

  /**
   * 圆形节点的状态样式控制
   * @param name: 当前节点状态名称
   * @param value: 当前节点的值(或者节点的标签)
   * @param item: 当前节点
   */
  setState: (name: any, value: any, item: any) => {
    const group = item.get('group');
    if (name === 'layoutEnd' && value) {
      const labelShape = group.find((e) => e.get('name') === 'text-shape');
      if (labelShape) labelShape.set('visible', true);
    } else if (name === 'hover') {
      if (item.hasState('focus')) {
        return;
      }
      const halo = group.find((e) => e.get('name') === 'halo-shape');
      const keyShape = item.getKeyShape();
      const colorSet = item.getModel().colorSet || defaultColorSets[0];
      if (value) {
        halo && halo.show();
        keyShape.attr('fill', colorSet.activeFill);
      } else {
        halo && halo.hide();
        keyShape.attr('fill', colorSet.mainFill);
      }
    } else if (name === 'focus') {
      const stroke = group.find((e) => e.get('name') === 'stroke-shape');
      const label = group.find((e) => e.get('name') === 'text-shape');
      const keyShape = item.getKeyShape();
      const colorSet = item.getModel().colorSet || defaultColorSets[0];
      if (value) {
        stroke && stroke.show();
        keyShape.attr('fill', colorSet.selectedFill);
        label && label.attr('fontWeight', 800);
      } else {
        stroke && stroke.hide();
        keyShape.attr('fill', colorSet.mainFill); // '#2B384E'
        label && label.attr('fontWeight', 400);
      }
    }
  },
  update: undefined,
};
