import G6 from '@antv/g6';
// 默认背景色
const defaultDarkBack = 'rgb(43, 47, 51)';
// 节点无效时的颜色
const disableColor = '#777';
// 主题颜色
const defaultTheme = 'dark';

const defaultG6Layout = 'gForce';
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
const defaultColorSets = G6.Util.getColorSetsBySubjectColors(subjectColors, defaultDarkBack, defaultTheme, disableColor);

// 定义动画配置信息
const duration = 2000;
const animateOpacity = 0.6;
const animateBackOpacity = 0.1;
const virtualEdgeOpacity = 0.1;
const realEdgeOpacity = 0.2;

// 自定义节点和边的名称
const g6NodeEdgeDefinition = {
  ellipseNode: 'ellipse-node',
  circleNode: 'circle-node',
  ellipseEdge: 'ellipse-line',
  circleEdge: 'circle-line',
};

// 定义一个全局的样式
const global = {
  node: {
    style: {
      fill: '#2B384E',
    },
    labelCfg: {
      style: {
        fill: '#acaeaf',
        stroke: '#191b1c',
      },
    },
    stateStyles: {
      focus: {
        fill: '#2B384E',    //填充颜色
        stroke: '#fff',     //描边的颜色
      },
    },
    linkPoints: {
      left: true,
      right: true,
      fill: '#6DD400',
      lineWidth: 0.5,
      stroke: '#FFFFFF',
    }
  },
  edge: {
    // 边样式配置
    style: {
      stroke: '#acaeaf',         // 边颜色
      realEdgeStroke: '#acaeaf', //'#f00', --- 扩展属性，用于交互时使用
      strokeOpacity: 0.2,        // 边的透明度
    },
    // 边的文本配置
    labelCfg: {
      // 边的文本显示样式
      style: {
        fill: '#acaeaf',            // 文本颜色
        realEdgeStroke: '#acaeaf', //'#f00',
        realEdgeOpacity: 0.5,
        stroke: '#191b1c',  // 文本描边颜色
      },
    },
    // 边交互时的样式
    stateStyles: {
      focus: {
        stroke: '#fff', // '#3C9AE8',
      },
    },
  },
};

// 定义G6 椭圆形节点
export const ellipseNodeDefinition = {
  /**
   * 椭圆节点的绘制方法，并返回椭圆节点的外围边框样式
   * @param config, 当前节点的信息
   * @param group
   */
  draw(config: any, group: any) {
    // 椭圆的宽，高
    let height = 32;
    // 基于文字动态获取节点的长度
    let dynamicWidth = config.name.length * 70 / 3;
    let width = dynamicWidth < 70 ? 70 : dynamicWidth;

    // 获取节点样式
    const style = config.style || global.node.style;
    const nodeColorSets = config.colorSet || defaultColorSets[0];

    // 鼠标悬浮时显示的效果，默认不显示
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
      name: 'hover-shape',
      visible: false, // 默认不显示，用于鼠标点击或者其他动作的交互效果
    });
    // 椭圆节点获得焦点后的光圈效果，默认不显示
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
      name: 'focus-shape',
      visible: false, // 默认不显示，用于鼠标点击或者其他动作的交互效果
    });

    // 椭圆节点外围边框，采用虚线勾勒的样式， 默认节点显示的效果
    const nodeOutlineShape = group.addShape('rect', {
      attrs: {
        ...style,
        x: -width / 2,
        y: -height / 2,
        width,
        height,
        fill: nodeColorSets.mainFill, // '#3B4043',
        stroke: nodeColorSets.mainStroke, // 虚线的颜色，这里采用传递进来的随机颜色
        lineWidth: 0.5, // 虚线的宽度
        cursor: 'pointer',
        radius: height / 2 || 13,
        lineDash: [2, 2], // 虚线中点的间距
      },
      name: 'default-dash-outline',
    });

    // 获取文本的配置项
    let labelCfg = config.labelCfg || global.node.labelCfg;
    // 保存文本的样式
    let labelStyle = {};
    if (labelCfg) {
      // 接收多个参数，第一个参数是目标对象，后面的都是源对象，assign方法将多个原对象的属性和方法都合并到了目标对象上面，如果在这个过程中出现同名的属性（方法），后合并的属性（方法）会覆盖之前的同名属性（方法）
      labelStyle = Object.assign(labelStyle, labelCfg.style);
    }
    // 为椭圆节点添加文字标签
    group.addShape('text', {
      attrs: {
        text: `${config.name}`, // 节点的文字采用参数传递进来
        x: 0,
        y: 0,
        textAlign: 'center',
        textBaseline: 'middle',
        cursor: 'pointer',
        fontSize: 12,
        fill: '#fff',
        opacity: 0.85,
        fontWeight: 200,
      },
      name: 'text-shape',
      draggable: true,
    });

    // // 绘制节点的连接点
    // if (config.new) {
    //   let linkPoints = config.linkPoints || global.node.linkPoints;
    //   group.addShape('circle', {
    //     attrs: {
    //       x: width / 2,
    //       y: 0 ,
    //       r: 4,
    //       fill: linkPoints.fill,
    //       lineWidth: linkPoints.lineWidth,
    //       stroke: linkPoints.stroke,
    //     },
    //     name: 'right-link-circle',
    //   });
    //   group.addShape('circle', {
    //     attrs: {
    //       x: - width / 2,
    //       y: 0 ,
    //       r: 4,
    //       fill: linkPoints.fill,
    //       lineWidth: linkPoints.lineWidth,
    //       stroke: linkPoints.stroke,
    //     },
    //     name: 'left-link-circle',
    //   });
    // }
    // 输出默认的图形
    return nodeOutlineShape;
  },

  /**
   * 节点绘制过程控制，绘制到哪一步
   * @param name: 当前节点状态名称
   * @param value: 当前节点的值(或者节点的标签)
   * @param item: 当前节点
   */
  setState: (name: any, value: any, item: any) => {
    // 获取该节点的分组信息
    const group = item.get('group');
    const keyShape = item.getKeyShape();
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
      // 根据名称获取到绘制的悬浮效果
      const hoverShape = group.find((e) => e.get('name') === 'hover-shape');
      const colorSet = item.getModel().colorSet || defaultColorSets[0];
      if (value) {
        hoverShape && hoverShape.show();
        keyShape.attr('fill', colorSet.activeFill);
      } else {
        hoverShape && hoverShape.hide();
        keyShape.attr('fill', colorSet.mainFill);
      }
    } else if (name === 'focus') {
      const stroke = group.find((e) => e.get('name') === 'focus-shape');
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

  // 设置线条的连接终点
  getAnchorPoints(){
    return [
      [0, 0.5], // 左侧中间
      [1, 0.5], // 右侧中间
    ];
  },
  update: undefined,
};

// 定义G6 圆形节点
export const circleNodeDefinition = {
  draw(config: any, group: any) {
    // 定义圆形节点的半径
    let dynamicRadio = config.name.length * 30 / 3;
    let r = dynamicRadio < 53 ? 53 : dynamicRadio;

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
      name: 'hover-shape',
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
      name: 'focus-shape',
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
      name: 'default-circle-shape',
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
      const halo = group.find((e) => e.get('name') === 'hover-shape');
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
      const stroke = group.find((e) => e.get('name') === 'focus-shape');
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

// 定义G6 椭圆形节点的边，重新定义状态事件，继承系统自带的椭圆形边
export const edgeEllipseLineDefinition = {

  // 边绘制成功后触发
  afterDraw(cfg, group) {
    // 这里获取默认的边对象
    const shape = group.get('children')[0];
    // 设置边上箭头的样式
    shape.attr("endArrow", {
      path: 'M 0,0 L 8,4 L 8,-4 Z',
      fill: global.edge.style.stroke,
      stroke: global.edge.style.stroke,
      opacity: global.edge.style.strokeOpacity,
    });
    // 获取边的长度，动画绘制边的效果
    // const length = shape.getTotalLength();
    // 设置线条的动画
    // shape.animate(
    //   (ratio) => {
    //     const startLen = ratio * length;
    //     const cfg = {
    //       lineDash: [startLen, length - startLen],
    //     };
    //     return cfg;
    //   },
    //   { repeat: true, duration: 2000,},
    // );
  },
  // 边线焦点变动后样式变化
  setState: (name: any, value: any, item: any) => {
    const group = item.get('group');
    const model = item.getModel();
    console.log('edgeclick', name);
    if (name === 'focus') {
      const back = group.find((ele) => ele.get('name') === 'back-line');
      if (back) {
        back.stopAnimate();
        back.remove();
        back.destroy();
      }
      const keyShape = group.find((ele) => ele.get('name') === 'edge-shape');
      const arrow = model.style.endArrow;
      if (value) {
        if (keyShape.cfg.animation) {
          keyShape.stopAnimate(true);
        }
        keyShape.attr({
          strokeOpacity: animateOpacity,
          opacity: animateOpacity,
          stroke: '#fff',
          endArrow: {
            ...arrow,
            stroke: '#fff',
            fill: '#fff',
          },
        });
        if (model.isReal) {
          const { lineWidth, path, endArrow, stroke } = keyShape.attr();
          const back = group.addShape('path', {
            attrs: {
              lineWidth,
              path,
              stroke,
              endArrow,
              opacity: animateBackOpacity,
            },
            name: 'back-line',
          });
          back.toBack();
          const length = keyShape.getTotalLength();
          keyShape.animate(
            (ratio) => {
              // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
              const startLen = ratio * length;
              // Calculate the lineDash
              const cfg = {
                lineDash: [startLen, length - startLen],
              };
              return cfg;
            },
            {
              repeat: true, // Whether executes the animation repeatly
              duration, // the duration for executing once
            }
          );
        } else {
          let index = 0;
          const lineDash = keyShape.attr('lineDash');
          const totalLength = lineDash[0] + lineDash[1];
          keyShape.animate(
            () => {
              index++;
              if (index > totalLength) {
                index = 0;
              }
              const res = {
                lineDash,
                lineDashOffset: -index,
              };
              // returns the modified configurations here, lineDash and lineDashOffset here
              return res;
            },
            {
              repeat: true, // whether executes the animation repeatly
              duration, // the duration for executing once
            }
          );
        }
      } else {
        keyShape.stopAnimate();
        const stroke = '#acaeaf';
        const opacity = model.isReal ? realEdgeOpacity : virtualEdgeOpacity;
        keyShape.attr({
          stroke,
          strokeOpacity: opacity,
          opacity,
          endArrow: {
            ...arrow,
            stroke,
            fill: stroke,
          },
        });
      }
    }
  },

  update: undefined,
};

// 定义圆形节点的连接线
export const edgeCircleLineDefinition = {
  // 边线焦点变动后样式变化
  setState: (name: any, value: any, item: any) => {
    const group = item.get('group');
    const model = item.getModel();
    if (name === 'focus') {
      const keyShape = group.find((ele) => ele.get('name') === 'edge-shape');
      const back = group.find((ele) => ele.get('name') === 'back-line');
      if (back) {
        back.stopAnimate();
        back.remove();
        back.destroy();
      }
      const arrow = model.style.endArrow;
      if (value) {
        if (keyShape.cfg.animation) {
          keyShape.stopAnimate(true);
        }
        keyShape.attr({
          strokeOpacity: animateOpacity,
          opacity: animateOpacity,
          stroke: 'yellow',
          endArrow: {
            ...arrow,
            stroke: '#fff',
            fill: '#fff',
          },
        });
        if (model.isReal) {
          const { path, stroke, lineWidth } = keyShape.attr();
          const back = group.addShape('path', {
            attrs: {
              path,
              stroke,
              lineWidth,
              opacity: animateBackOpacity,
            },
            name: 'back-line',
          });
          back.toBack();
          const length = keyShape.getTotalLength();
          keyShape.animate(
            (ratio) => {
              // the operations in each frame. Ratio ranges from 0 to 1 indicating the prograss of the animation. Returns the modified configurations
              const startLen = ratio * length;
              // Calculate the lineDash
              const cfg = {
                lineDash: [startLen, length - startLen],
              };
              return cfg;
            },
            {
              repeat: true, // Whether executes the animation repeatly
              duration, // the duration for executing once
            }
          );
        } else {
          const lineDash = keyShape.attr('lineDash');
          const totalLength = lineDash[0] + lineDash[1];
          let index = 0;
          keyShape.animate(
            () => {
              index++;
              if (index > totalLength) {
                index = 0;
              }
              const res = {
                lineDash,
                lineDashOffset: -index,
              };
              // returns the modified configurations here, lineDash and lineDashOffset here
              return res;
            },
            {
              repeat: true, // whether executes the animation repeatly
              duration, // the duration for executing once
            }
          );
        }
      } else {
        keyShape.stopAnimate();
        const stroke = '#acaeaf';
        const opacity = model.isReal ? realEdgeOpacity : virtualEdgeOpacity;
        keyShape.attr({
          stroke,
          strokeOpacity: opacity,
          opacity: opacity,
          endArrow: {
            ...arrow,
            stroke,
            fill: stroke,
          },
        });
      }
    }
  },
};

/**
 * 节点通用处理方法
 * @param graph
 */
// 截断长文本。length 为文本截断后长度
export const formatText = (text, length = 5, elipsis = '...') => {
  if (!text) return '';
  if (text.length > length) {
    return `${text.substr(0, length)}${elipsis}`;
  }
  return text;
};

const labelFormatter = (text, minLength = 10) => {
  if (text && text.split('').length > minLength) return `${text.substr(0, minLength)}...`;
  return text;
};

// 清除图上所有节点的 focus 状态及相应样式
const clearFocusNodeState = (graph) => {
  const focusNodes = graph.findAllByState('node', 'focus');
  focusNodes.forEach((nodeItem) => {
    graph.setItemState(nodeItem, 'focus', false); // false
  });
};

// 清除图上所有边的 focus 状态及相应样式
const clearFocusEdgeState = (graph) => {
  const focusEdges = graph.findAllByState('edge', 'focus');
  focusEdges.forEach((fedge) => {
    graph.setItemState(fedge, 'focus', false);
  });
};

export const clearFocusItemState = (graph) => {
  if (!graph) return;
  clearFocusNodeState(graph);
  clearFocusEdgeState(graph);
};

/**
 *
 * 注意： g6数据格式中的id不能为number，只能为string
 *
 * 将api返回的结果，处理成可以处理的数据结构.
 * 主要是补充节点数据需要显示的颜色，需要渲染的形状， 返回格式化后的数据。
 *
 * 格式化好的数据，需要经过processNodesAndEdges 方法进行处理
 * @param data api返回的数据
 */
export const formatApiDataNode = (data: any) => {
  const formatData = { nodes: [], edges: [] };
  data.nodes.forEach((item, i) => {
    let node = {
      id: item.id,
      name: item.name,
      code: item.code,
      new: true,
      label: item.label ? item.label.split(',') : [],
      colorSet: defaultColorSets[i],
      type: g6NodeEdgeDefinition.ellipseNode, // 椭圆
      style: item.style || global.node.style,
      entityType: item.entityType,
    };
    // @ts-ignore
    formatData.nodes.push(node);
  });

  data.edges.forEach((item, i) => {
    let edge = {
      id: item.id,
      source: item.fromEntityId,
      target: item.toEntityId,
      sourceType: item.fromEntityType,
      targetType: item.toEntityType,
      relationType: item.relationType,
      colorSet: defaultColorSets[i],
      type: g6NodeEdgeDefinition.ellipseEdge,
      style: item.style || global.edge.style,
      targetAnchor: 3,
      sourceAnchor: 1,
    };
    // @ts-ignore
    formatData.edges.push(edge);
  });
  return formatData;
};

/**
 * 添加G6中的事件回调，包括节点光标移入移除等
 * @param g6Instance
 * @param entityClickCallback
 */
const bindListener = (g6Instance: any, entityClickCallback: any) => {
  // 鼠标节点悬浮事件
  g6Instance.on('node:mouseenter', (evt) => {
    const item = evt.item;
    g6Instance.setItemState(item, 'hover', true);
  });
  // 鼠标节点移出事件
  g6Instance.on('node:mouseleave', (evt) => {
    const item = evt.item;
    g6Instance.setItemState(item, 'hover', false);
  });

  g6Instance.on('node:click', (evt) => {
    const item = evt.item;
    clearFocusItemState(g6Instance);
    g6Instance.setItemState(item, 'focus', true);
    // 激活边的动画效果和样式
    if(entityClickCallback){
      entityClickCallback(item.get('id'), item.get('model').entityType);
    }
  });
  // click canvas to cancel all the focus state
  g6Instance.on('canvas:click', evt => {
    clearFocusItemState(g6Instance);
  });
};

// 获取当前画布的布局样式
export const getG6LayoutConfig = (graph, largeGraphMode, configSettings) => {
  let {
    linkDistance, // 节点的距离
    edgeStrength, // 边的重力作用
    nodeStrength, // 节点的重力作用
    nodeSpacing, // 节点间的间隔
    nodeSize, // 节点大小
    collideStrength, // 混合力大小
    alpha, // 透明度
    alphaDecay,
    alphaMin,
  } = configSettings || { preventOverlap: true };

  if (!linkDistance && linkDistance !== 0) linkDistance = 225;
  if (!edgeStrength && edgeStrength !== 0) edgeStrength = 50;
  if (!nodeStrength && nodeStrength !== 0) nodeStrength = 200;
  if (!nodeSpacing && nodeSpacing !== 0) nodeSpacing = 5;

  const config = {
    minMovement: 0.01,
    maxIteration: 5000,
    preventOverlap: true,
    damping: 0.99,
    // 设置边的长度，长度等于量节点间的距离
    linkDistance: () => {
      // let dist = linkDistance;
      // const sourceNode = nodeMap[d.source] || aggregatedNodeMap[d.source];
      // const targetNode = nodeMap[d.target] || aggregatedNodeMap[d.target];
      // // 两端都是聚合点
      // if (sourceNode.level && targetNode.level) dist = linkDistance * 3;
      // // 一端是聚合点，一端是真实节点
      // else if (sourceNode.level || targetNode.level) dist = linkDistance * 1.5;
      // if (!sourceNode.level && !targetNode.level) dist = linkDistance * 0.3;
      return linkDistance * 0.7;
    },
    nodeStrength: (d) => {
      // 给离散点引力，让它们聚集
      if (d.degree === 0) return -10;
      // 聚合点的斥力大
      if (d.level) return nodeStrength * 2;
      return nodeStrength;
    },
    nodeSize: (d) => {
      if (!nodeSize && d.size) return d.size;
      return 50;
    },
    nodeSpacing: (d) => {
      if (d.degree === 0) return nodeSpacing * 2;
      if (d.level) return nodeSpacing;
      return nodeSpacing;
    },
    onLayoutEnd: () => {
      if (largeGraphMode) {
        graph.getEdges().forEach((edge) => {
          if (!edge.oriLabel) return;
          edge.update({
            label: labelFormatter(edge.oriLabel, 5),
          });
        });
      }
    },
    tick: () => {
      graph.refreshPositions();
    },
  };

  if (nodeSize) config['nodeSize'] = nodeSize;
  if (collideStrength) config['collideStrength'] = collideStrength;
  if (alpha) config['alpha'] = alpha;
  if (alphaDecay) config['alphaDecay'] = alphaDecay;
  if (alphaMin) config['alphaMin'] = alphaMin;
  return config;
};

// 初始化
export const G6RegisterNodeAndEdge = () => {
  // 注册椭圆节点
  G6.registerNode(g6NodeEdgeDefinition.ellipseNode, ellipseNodeDefinition, 'single-node');
  // 注册圆形节点，该圆形节点继承至椭圆节点
  // G6.registerNode(g6NodeEdgeDefinition.circleNode, circleNodeDefinition, g6NodeEdgeDefinition.ellipseNode);
  // 注册椭圆节点的边
  G6.registerEdge(g6NodeEdgeDefinition.ellipseEdge, edgeEllipseLineDefinition, 'line');
  // 注册圆形节点的边
  // G6.registerEdge(g6NodeEdgeDefinition.circleEdge, ellipseNodeDefinition, 'single-edge');
};

/**
 * 启动G6引擎
 * @param g6Instance      G6实例化对象
 * @param largeGraphMode  是否为大图模式，默认为true
 * @param canvasWidth     画布宽度
 * @param canvasHeight    画布高度
 * @param type            采用何种类型布局
 * @param data            数据
 * @param entityClickCallback 节点点击后触发的回调事件
 * @constructor
 */
export const G6Starter = (
  g6Instance: any,
  largeGraphMode: boolean,
  canvasWidth: number,
  canvasHeight: number,
  type: string,
  data: any,
  entityClickCallback?: (entityId: number, entityType: string, entityName?:string) => void
) => {
  // 1、格式化数据
  const formatData = formatApiDataNode(data);
  // 2、禁止画布本地刷新
  g6Instance.get('canvas').set('localRefresh', false);
  // 3、设置画布的样式及画布中心位置
  const layoutConfig: any = getG6LayoutConfig(g6Instance, largeGraphMode, null);
  layoutConfig.center = [canvasWidth / 2, canvasHeight / 2];
  layoutConfig.type = type || defaultG6Layout;
  g6Instance.updateLayout(layoutConfig);
  // 6、绑定回调事件并初始化G6数据并渲染
  bindListener(g6Instance, entityClickCallback);
  g6Instance.data({ nodes: formatData.nodes, edges: formatData.edges });
};


