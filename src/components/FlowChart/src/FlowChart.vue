<template>
  <div class="h-full" :class="prefixCls">
    <FlowChartToolbar :prefixCls="prefixCls" v-if="toolbar"
                      :ruleChainDeploy="ruleChainDeploy"
                      @view-data="handlePreview"
                      @save-click="submitHandler"
                      @debug-change="rulerDebugChange"/>
    <div ref="lfElRef" class="h-full"></div>
    <BasicModal @register="register" title="流程数据" width="50%">
      <JsonPreview :data="graphData" />
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import type { Ref } from 'vue';
  import type { Definition } from '@logicflow/core';
  import { defineComponent, ref, onMounted, unref, nextTick, computed, watch } from 'vue';
  import FlowChartToolbar from './FlowChartToolbar.vue';
  import LogicFlow from '@logicflow/core';
  import ThingsDndPanel from '/@/components/FlowChartPanel';
  import ThingsNode from '/@/components/FlowChartNode';
  import { Snapshot } from '@logicflow/extension';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useAppStore } from '/@/store/modules/app';
  import { createFlowChartContext } from './useFlowContext';
  import { useModal, BasicModal } from '/@/components/Modal';
  import { JsonPreview } from '/@/components/CodeEditor';
  import { configDefaultDndPanel } from './config';
  import '@logicflow/core/dist/style/index.css';
  import '@logicflow/extension/lib/style/index.css';

  export default defineComponent({
    name: 'FlowChart',
    components: { BasicModal, FlowChartToolbar, JsonPreview },
    props: {
      flowOptions: {
        type: Object as PropType<Definition>,
        default: () => ({}),
      },
      data: {
        type: Object as PropType<any>,
        default: () => ({}),
      },
      toolbar: {
        type: Boolean,
        default: true,
      },
      patternItems: {
        type: Array,
      },
      nodeDbClickCallback: { // 用于节点点击的回调函数
        type: Object,
      },
      ruleChainActive: {  // 规则链是否启动
        type: Boolean,
        default: false,
      }
    },
    emits: ['submitBefore', 'debugChange'],
    setup(props,{ emit }) {

      const lfElRef = ref(null);
      const graphData = ref({});
      const ruleChainDeploy = ref(false);
      ruleChainDeploy.value = props.ruleChainActive;

      const lfInstance = ref(null) as Ref<LogicFlow | null>;

      const { prefixCls } = useDesign('flow-chart');
      const appStore = useAppStore();
      const [register, { openModal }] = useModal();
      createFlowChartContext({
        logicFlow: lfInstance as unknown as LogicFlow,
      });

      const getFlowOptions = computed(() => {
        const { flowOptions } = props;

        const defaultOptions: Partial<Definition> = {
          grid: true,
          nodeTextEdit: false,
          edgeTextEdit: false,
          edgeTextDraggable: true,
          adjustEdge: false,
          background: {
            color: appStore.getDarkMode === 'light' ? '#f7f9ff' : '#151515',
          },
          keyboard: {
            enabled: true,
          },
          ...flowOptions,
        };
        return defaultOptions as Definition;
      });

      watch(
        () => props.data,
        () => {
          onRender();
        }
      );

      watch(
        () => unref(getFlowOptions),
        (options) => {
          unref(lfInstance)?.updateEditConfig(options);
        }
      );

      // init logicFlow
      async function init() {
        await nextTick();

        const lfEl = unref(lfElRef);
        if (!lfEl) {
          return;
        }
        LogicFlow.use(ThingsDndPanel);
        // Canvas configuration
        LogicFlow.use(Snapshot);
        // // Use the bpmn plug-in to introduce bpmn elements, which can be used after conversion in turbo
        // LogicFlow.use(BpmnElement);

        lfInstance.value = new LogicFlow({
          ...unref(getFlowOptions),
          container: lfEl,
        });

        // 注册自定义节点
        lfInstance.value.register(ThingsNode);

        // 注册自定义节点单击事件并屏蔽掉无用事件
        const nodeClickCallback = props.nodeDbClickCallback as (data: any) => void;
        lfInstance.value.on('node:dbclick', (ev) => nodeClickCallback(ev));

        const lf = unref(lfInstance)!;
        lf?.setDefaultEdgeType('bezier');
        lf?.setPatternItems(props.patternItems || configDefaultDndPanel(lf));
        await onRender();
      }

      async function onRender() {
        await nextTick();
        const lf = unref(lfInstance);
        if (!lf) {
          return;
        }
        // const lFData = toLogicFlowData(props.data);
        lf.render(props.data);
      }

      function handlePreview() {
        const lf = unref(lfInstance);
        if (!lf) {
          return;
        }
        graphData.value = unref(lf).getGraphData();
        openModal();
      }

      function submitHandler(startOrStop: boolean, callback: any){
        const lf = unref(lfInstance);
        if (!lf) {
          return;
        }
        emit('submitBefore', {
          callback: callback,
          type: startOrStop,
          data: unref(lf).getGraphData()
        });
      }




      function rulerDebugChange(state: boolean, debugCallback: any){
        emit('debugChange', state, debugCallback);
      }
      onMounted(init);
      return {
        register,
        ruleChainDeploy,
        prefixCls,
        lfElRef,
        // 暴露流程图对象，供上级组件使用
        lfInstance,
        handlePreview,
        submitHandler,
        rulerDebugChange,
        graphData,
      };
    },
  });
</script>
