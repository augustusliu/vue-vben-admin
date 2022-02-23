<template>
  <!--  <Loading :loading="loading" :absolute="absolute" :tip="tip" />-->
  <PageWrapper>
    <div :class="prefixCls" class="h-full" ref="g6Ref"></div>
  </PageWrapper>
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
  import { G6Register, G6Start } from './plugins/g6NodeDefinition';

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

      // 初始化
      async function init() {
        await nextTick();
        const g6El = unref(g6Ref);
        if (!g6El) {
          return;
        }
        // openLoading(true, true);
        // 注册G6自定义节点
        G6Register();
        // 初始化G6
        g6Instance.value = new G6.Graph({
          ...unref(getG6Options),
          container: g6El,
        });

        let g6Width = (g6Ref as any).value.clientWidth;
        let g6Height = document.body.clientHeight - 155;
        g6Instance.value.changeSize(g6Width, g6Height);
        // 启动G6
        G6Start(unref(g6Instance), true, g6Width, g6Height, g6Data);
        // openLoading(false, false);
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

    /* <!--background-color: @component-background;--> */
    background-color: #2b2f33;
  }
</style>
