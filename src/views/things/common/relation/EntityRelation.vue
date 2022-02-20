<template>
  <Loading :loading="loading" :absolute="absolute" :tip="tip" />
  <div :class="prefixCls" class="h-full" ref="g6Ref"></div>
</template>

<script lang="ts">
  import G6, { GraphOptions, Graph } from '@antv/g6';
  import {
    computed,
    defineComponent,
    nextTick,
    onMounted,
    reactive,
    Ref,
    ref,
    toRefs,
    unref,
  } from 'vue';
  import g6Data from './dataG6.json';
  import { PageWrapper } from '/@/components/Page';
  import { Loading } from '/@/components/Loading';

  export default defineComponent({
    name: 'RelationTree',
    components: { Loading, PageWrapper },
    // 定义G6 的配置，可以传递过来
    props: {
      g6Options: {
        type: Object as PropType<GraphOptions>,
        default: () => ({}),
      },
      data: {
        type: Object as PropType<any>,
        default: () => ({}),
      },
    },
    setup(props) {
      // 加载进度条状态
      const compState = reactive({
        absolute: false,
        loading: false,
        tip: '加载中...',
      });
      // 展开进度条及关闭操作
      function openLoading(absolute: boolean, loading: boolean) {
        compState.absolute = absolute;
        compState.loading = loading;
      }
      // 保存dom对象
      const g6Ref = ref(null);
      // G6实例
      const g6Instance = ref(null) as Ref<Graph | null>;
      // G6参数配置
      const getG6Options = computed(() => {
        // 传递给组件的配置信息
        const { g6Options } = props;
        // 定义默认的G6配置
        const defaultOptions: Partial<GraphOptions> = {
          width: 500,
          height: 500,
          fitView: true,
          fitViewPadding: [50, 50, 50, 50],
          minZoom: 0.1,
          groupByTypes: false,
          modes: {
            default: [
              {
                type: 'drag-canvas',
                enableOptimize: true,
              },
              {
                type: 'zoom-canvas',
                enableOptimize: true,
                optimizeZoom: 0.01,
              },
              'drag-node',
              'shortcuts-call',
            ],
            lassoSelect: [
              {
                type: 'zoom-canvas',
                enableOptimize: true,
                optimizeZoom: 0.01,
              },
              {
                type: 'lasso-select',
                selectedState: 'focus',
                trigger: 'drag',
              },
            ],
            edit: ['click-select'], // 节点点击编辑交互
          },
          layout: {
            type: 'force',
            // 防重
            preventOverlap: true,
            // 定义边长，起始节点边长较长，其余边长为30
            linkDistance: (d) => {
              if (d.source.id === 'node0') {
                return 100;
              }
              return 30;
            },
            nodeStrength: (d) => {
              if (d.isLeaf) {
                return -50;
              }
              return -10;
            },
            edgeStrength: (d) => {
              if (d.source.id === 'node1' || d.source.id === 'node2' || d.source.id === 'node3') {
                return 0.7;
              }
              return 0.1;
            },
            onLayoutEnd: () => {
              // 布局完成后 ，取消加载框
              openLoading(false, false);
            },
          },
          defaultNode: {
            /* node type */
            type: 'circle',
            /* node size */
            size: [60],
            /* style for the keyShape */
            // style: {
            //   fill: '#9EC9FF',
            //   stroke: '#5B8FF9',
            //   lineWidth: 3,
            // },
            labelCfg: {
              /* label's position, options: center, top, bottom, left, right */
              position: 'bottom',
              /* label's offset to the keyShape, 4 by default */
              //   offset: 12,
              /* label's style */
              //   style: {
              //     fontSize: 20,
              //     fill: '#ccc',
              //     fontWeight: 500
              //   }
            },
            /* configurations for four linkpoints */
            linkPoints: {
              top: false,
              right: false,
              bottom: false,
              left: false,
              /* linkPoints' size, 8 by default */
              //   size: 5,
              /* linkPoints' style */
              //   fill: '#ccc',
              //   stroke: '#333',
              //   lineWidth: 2,
            },
            /* icon configuration */
            icon: {
              /* whether show the icon, false by default */
              show: false,
              /* icon's img address, string type */
              // img: SvgIcon['asset_apartment'],
              /* icon's size, 20 * 20 by default: */
              //   width: 40,
              //   height: 40
            },
          },
          ...g6Options,
        };
        return defaultOptions as GraphOptions;
      });

      // 初始化
      async function init() {
        await nextTick();
        const g6El = unref(g6Ref);
        if (!g6El) {
          return;
        }
        // 初始化G6
        g6Instance.value = new G6.Graph({
          ...unref(getG6Options),
          container: g6El,
        });
        await onRender();
      }
      // G6渲染
      async function onRender() {
        await nextTick();
        openLoading(true, true);
        const g6r = unref(g6Instance);
        if (!g6r) {
          return;
        }

        // 动态调整画布大小
        g6r.changeSize((g6Ref as any).value.clientWidth, document.body.clientHeight - 80 - 30);
        // window.onresize = () => {
        //   g6r.changeSize((g6Ref as any).value.clientWidth, document.body.clientHeight - 80 - 72 - 38);
        // }
        g6r.data({
          nodes: g6Data.nodes,
          edges: g6Data.edges.map(function (edge, i) {
            (edge as any).id = 'edge' + i;
            return Object.assign({}, edge);
          }),
        });
        g6r.render();
        g6r.on('node:dragstart', function (e) {
          g6r.layout();
          refreshDragedNodePosition(e);
        });
        g6r.on('node:drag', function (e) {
          refreshDragedNodePosition(e);
        });
        g6r.on('node:dragend', function (e) {
          (e as any).item.get('model').fx = null;
          (e as any).item.get('model').fy = null;
        });
        g6r.fitView();
      }

      function refreshDragedNodePosition(e) {
        const model = e.item.get('model');
        model.fx = e.x;
        model.fy = e.y;
      }
      onMounted(init);
      return {
        prefixCls: 'entity-relation',
        g6Ref,
        ...toRefs(compState),
      };
    },
  });
</script>

<style lang="less">
  .entity-relation {
    width: 100%;
    background-color: @component-background;
  }
</style>
