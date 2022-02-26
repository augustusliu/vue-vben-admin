<template>
  <div class="h-full" :class="prefixCls" ref="parentContainer">
    <div ref="g6ElRef" class="h-full"></div>
  </div>
</template>

<script lang="ts">
  import G6, { GraphOptions, Graph } from '@antv/g6';
  import {
    computed,
    defineComponent,
    nextTick,
    onMounted,
    Ref,
    ref,
    unref, watch,
  } from 'vue';
  import { G6RegisterNodeAndEdge, G6Starter } from './g6Config';

  export default defineComponent({
    name: 'G6Graph',
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
      // 用于节点点击的回调事件
      afterClickCallback: {
        type: Object,
      },
    },
    setup(props) {

      // 保存dom对象
      const g6ElRef = ref(null);
      const parentContainer = ref(null);
      // G6实例
      const g6Instance = ref(null) as Ref<Graph | null>;
      // 将G6作为动态配置
      const dynamicG6Options = computed(() => {
        // 传递给组件的配置信息
        const { g6Options } = props;
        // 定义默认的G6配置
        const defaultOptions: Partial<GraphOptions> = {
          width: 500,
          height: 300,
          minZoom: 0.1,
          groupByTypes: false,
          modes: {
            default: [
              'drag-node', // 允许拖拽节点
              {
                type: 'drag-canvas',    // 启用画布的拖拽
                enableOptimize: true,
              },
              {
                type: 'zoom-canvas',    // 启用画布缩放功能
                enableOptimize: true,
                optimizeZoom: 0.01,
              },
            ],
          },
          layout: {
            type: 'force', // 默认布局
            linkDistance: 100, // 设置边长为 100
            preventOverlap: true, // 设置防止重叠
          },
          defaultEdge: {
            type: 'ellipse-line',
          },
          ...g6Options,
        };
        return defaultOptions as GraphOptions;
      });

      // g6在另种情况下会动态更新界面：1、数据变化；2、样式配置变化，都采用watch完成
      watch(
        () => props.data,
        () => {
          onRender();
        }
      );
      watch(
        () => unref(dynamicG6Options),
        (options) => {
          unref(g6Instance)?.updateLayout(options);
        }
      );

      const entityClickCallback = props.afterClickCallback as (entityId: number, entityType: string) => void;

      // g6初始化
      async function init() {
        await nextTick(); // 等待dom刷新完毕
        const conEl = unref(parentContainer);
        if(!conEl){
          return;
        }
        const g6El = unref(g6ElRef);  // 获取container
        if (!g6El) {
          return;
        }
        G6RegisterNodeAndEdge(); // 注册对G6自定义的内容

        // 实例化G6
        g6Instance.value = new G6.Graph({
          ...unref(dynamicG6Options),
          container: g6El,
        });
        let g6Width = (conEl as any).clientWidth;
        let g6Height = (conEl as any).clientHeight;
        // 启动G6
        G6Starter(unref(g6Instance), true, g6Width, g6Height ,'force', props.data, entityClickCallback);
        onRender();
      }

      // 基于数据刷新
      async function onRender() {
        await nextTick();
        const conEl = unref(parentContainer);
        if(!conEl){
          return;
        }
        const g6 = unref(g6Instance);
        if (!g6) {
          return;
        }
        let g6Width = (conEl as any).clientWidth;
        let g6Height = (conEl as any).clientHeight;
        g6.changeSize(g6Width, g6Height);
        g6.render();
      }
      onMounted(init);
      return {
        prefixCls: "entity-relation",
        g6ElRef,
        parentContainer,
      };
    },
  });
</script>

<style lang="less">
  .entity-relation {
    width: 100%;
    background-color: @component-background;
    div{
      background-color: #212121;
    }
  }
</style>
