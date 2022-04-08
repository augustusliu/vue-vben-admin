<template>
  <div :class="`${prefixCls}-toolbar`" class="flex items-center px-2" >
    <div class="h-full py-1" style="width:60%">
      <template v-for="item in toolbarItemList" :key="item.type">
        <Tooltip placement="bottom" v-bind="item.disabled ? { visible: false } : {}">
          <template #title>{{ item.tooltip }}</template>
          <span :class="`${prefixCls}-toolbar__icon`" v-if="item.icon" @click="onControl(item)">
            <Icon
              :icon="item.icon"
              :class="item.disabled ? 'cursor-not-allowed disabeld' : 'cursor-pointer'"
            />
          </span>
        </Tooltip>
        <Divider v-if="item.separate" type="vertical" />
      </template>
    </div>
    <div class="h-full" style="width: 40%; padding-top: 5px; padding-bottom: 5px;">
      <Button size="large" class="mx-2 iothings-deploy-btn" v-if="deployed"
              @click="publishEvent(false)" >停止</Button>

      <Button size="large" class="mx-2 iothings-deploy-btn" v-if="!deployed"
              @click="publishEvent(true)" >部署</Button>

      <Checkbox :defaultChecked="false" v-if="deployed"
                class="mx-2 iothings-debug-btn"
                :onChange="debugChange">调试</Checkbox>
      <Button size="large"
              @click="publishEvent(2)"
              :class="!isDebug ? 'debug-btn-display-none': 'mx-2 iothings-save-btn cursor-pointer' ">调试信息</Button>
    </div>
  </div>
</template>
<script lang="ts">
  import type { ToolbarConfig } from './types';

  import { defineComponent, ref, onUnmounted, unref, nextTick, watchEffect } from 'vue';
  import { Divider, Tooltip, Checkbox } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';

  import { useFlowChartContext } from './useFlowContext';
  import { ToolbarTypeEnum } from './enum';

  export default defineComponent({
    name: 'FlowChartToolbar',
    components: { Icon, Divider, Tooltip, Checkbox },
    props: {
      prefixCls: String,
      ruleChainDeploy: Boolean,
    },
    // vue 事件校验器
    emits: ['view-data','save-click', 'debug-change'],
    setup(props, { emit }) {
      const toolbarItemList = ref<ToolbarConfig[]>([
        {
          type: ToolbarTypeEnum.ZOOM_IN,
          icon: 'codicon:zoom-out',
          tooltip: '缩小',
        },
        {
          type: ToolbarTypeEnum.ZOOM_OUT,
          icon: 'codicon:zoom-in',
          tooltip: '放大',
        },
        { separate: true },
        {
          type: ToolbarTypeEnum.RESET_ZOOM,
          icon: 'codicon:screen-normal',
          tooltip: '重置比例',
        },
        { separate: true },
        {
          type: ToolbarTypeEnum.UNDO,
          icon: 'ion:arrow-undo-outline',
          tooltip: '后退',
          disabled: true,
        },
        {
          type: ToolbarTypeEnum.REDO,
          icon: 'ion:arrow-redo-outline',
          tooltip: '前进',
          disabled: true,
        },
        { separate: true },
        {
          type: ToolbarTypeEnum.SNAPSHOT,
          icon: 'ion:download-outline',
          tooltip: '下载',
        },
        {
          type: ToolbarTypeEnum.VIEW_DATA,
          icon: 'carbon:document-view',
          tooltip: '查看数据',
        },
      ]);

      const { logicFlow } = useFlowChartContext();
      const isDebug = ref(false);
      // 当前部署状态
      const deployed = ref(false);
      deployed.value = props.ruleChainDeploy || false;

      function onHistoryChange({ data: { undoAble, redoAble } }) {
        const itemsList = unref(toolbarItemList);
        const undoIndex = itemsList.findIndex((item) => item.type === ToolbarTypeEnum.UNDO);
        const redoIndex = itemsList.findIndex((item) => item.type === ToolbarTypeEnum.REDO);
        if (undoIndex !== -1) {
          unref(toolbarItemList)[undoIndex].disabled = !undoAble;
        }
        if (redoIndex !== -1) {
          unref(toolbarItemList)[redoIndex].disabled = !redoAble;
        }
      }

      // 发布事件, startOrUpdate当前状态，callback回调函数
      const publishEvent = (startOrUpdate: boolean) => {
        const lf = unref(logicFlow);
        if (!lf) {
          return;
        }

        emit('save-click', startOrUpdate, res => {
            // 如果是部署
           if(startOrUpdate){
             if(res){
               deployed.value = true;
             }else{
               deployed.value = false;
             }
           }else{
             if(res){
               deployed.value = false;
             }else{
               deployed.value = true;
             }
           }
        });
      }

      const debugChange = (event: any) => {
        emit('debug-change', event.target.checked, debugRes => {
          if(debugRes){
            isDebug.value = event.target.checked;
          }
        });
      }



      const onControl = (item) => {
        const lf = unref(logicFlow);
        if (!lf) {
          return;
        }
        switch (item.type) {
          case ToolbarTypeEnum.ZOOM_IN:
            lf.zoom();
            break;
          case ToolbarTypeEnum.ZOOM_OUT:
            lf.zoom(true);
            break;
          case ToolbarTypeEnum.RESET_ZOOM:
            lf.resetZoom();
            break;
          case ToolbarTypeEnum.UNDO:
            lf.undo();
            break;
          case ToolbarTypeEnum.REDO:
            lf.redo();
            break;
          case ToolbarTypeEnum.SNAPSHOT:
            lf.getSnapshot();
            break;
          case ToolbarTypeEnum.VIEW_DATA:
            emit('view-data');
            break;
        }
      };

      watchEffect(async () => {
        if (unref(logicFlow)) {
          await nextTick();
          unref(logicFlow)?.on('history:change', onHistoryChange);
        }
      });

      onUnmounted(() => {
        unref(logicFlow)?.off('history:change', onHistoryChange);
      });
      return { toolbarItemList, onControl, publishEvent, isDebug, debugChange, deployed };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-flow-chart-toolbar';

  html[data-theme='dark'] {
    .lf-dnd , .lf-dndpanel-things{
      background: #080808;
    }
    .lf-dnd-things-item-text{
      color: #434343;
    }
    .lf-edge path{
      stroke: #00feff;
      stroke-width: 1;
    }
  }
  .@{prefix-cls} {
    height: 36px;
    background-color: @app-content-background;
    border-bottom: 1px solid @border-color-base;

    .disabeld {
      color: @disabled-color;
    }

    &__icon {
      display: inline-block;
      padding: 2px 4px;
      margin-right: 10px;

      &:hover {
        color: @primary-color;
      }
    }

    .iothings-deploy-btn{
      width:70px;
      float: right;
      background-color: #aa3939;
      color: #ebccd1;
      cursor: pointer;
      border-radius: 2px;
    }
    .iothings-save-btn{
      width:70px;
      float: right;
      background-color: #408ede;
      color: #ebccd1;
      cursor: pointer;
      border-radius: 2px;
      margin-right: 20px;
    }
    .iothings-debug-btn{
      float: right;
      margin-right: 10px;
    }
    .iothings-deploy-btn:hover{
      color: #fff;
      background-color: #ff4d4f;
    }
    .iothings-save-btn:hover{
      background-color: #0b60be;
      color: #fff;
    }
  }

  .debug-btn-display-none{
    display: none;
  }

</style>
