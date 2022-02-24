<template>
  <div class="h-full" :class="prefixCls">
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
  import { PageWrapper } from '/@/components/Page';
  import { G6Register, G6Start ,formatApiDataNode } from './g6Config';

  export default defineComponent({
    name: 'G6Graph',
    components: { PageWrapper },
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
      // 保存dom对象
      const g6ElRef = ref(null);
      // G6实例
      const g6Instance = ref(null) as Ref<Graph | null>;
      // 将G6作为动态配置
      const dynamicG6Options = computed(() => {
        // 传递给组件的配置信息
        const { g6Options } = props;
        // 定义默认的G6配置
        const defaultOptions: Partial<GraphOptions> = {
          width: 500,
          height: 500,
          linkCenter: true,
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
          },
          layout: {
            type: 'gForce',
            minMovement: 0.01,
            onLayoutEnd: () => {},
          },
          defaultNode: {
            type: 'ellipse-node', // 节点类型，采用我们自定义的椭圆节点
            size: 20, // 节点大小
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
      // watch(
      //   () => unref(dynamicG6Options),
      //   (options) => {
      //     unref(g6Instance)?.updateLayout(options);
      //   }
      // );

      // g6初始化
      async function init() {
        await nextTick(); // 等待dom刷新完毕
        const g6El = unref(g6ElRef);  // 获取container
        if (!g6El) {
          return;
        }
        G6Register(); // 注册对G6自定义的内容

        // 实例化G6
        g6Instance.value = new G6.Graph({
          ...unref(dynamicG6Options),
          container: g6El,
        });

        let g6Width = (g6ElRef as any).value.clientWidth;
        let g6Height = document.body.clientHeight - 155;
        g6Instance.value.changeSize(g6Width, g6Height);
        // 启动G6
        G6Start(unref(g6Instance), true, g6Width, g6Height, props.data);
      }

      // 基于数据刷新
      async function onRender() {
        await nextTick();
        const g6 = unref(g6Instance);
        if (!g6) {
          return;
        }
        const formatData = formatApiDataNode(props.data);
        g6.changeData({ nodes: formatData.nodes, edges: formatData.edges });
        g6.render();
      }

      onMounted(init);
      return {
        prefixCls: "entity-relation",
        g6ElRef,
      };
    },
  });
</script>

<style lang="less">
  .entity-relation {
    width: 100%;
    background-color: @component-background;
    div{
      background-color: #2b2f33;
    }
  }
</style>
