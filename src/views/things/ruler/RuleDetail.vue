<template>
  <PageWrapper
    contentFullHeight
    fixedHeight
    :class="prefixCls">
      <FlowChart v-if="isShow"
                 ref="flowEl"
                 :patternItems="leftNodes"
                 :nodeDbClickCallback="nodeDbClickCallback"
                 :addEdgeClickCallback="edgeAddedCallback"
                 :edgeDbClickCallback="edgeDbClickCallback"
      />
    <DynamicNodeDrawer @register="registerDrawer"
                       @success="onInputDrawerSuccess"/>
  </PageWrapper>
</template>

<script lang="ts">
  import { FlowChart } from '/@/components/FlowChart';
  import { getNodeTemplateMenuApi } from '/@/api/things/ruler/ruleApi';
  import { defineComponent, onMounted, ref, unref } from "vue";
  import DynamicNodeDrawer from './DynamicNodeDrawer.vue';
  import {useDrawer} from "/@/components/Drawer";
  import LogicFlow from "@logicflow/core";

  export default defineComponent({
    name: 'RuleDetail',
    components: { FlowChart , DynamicNodeDrawer },
    setup() {
      const leftNodes:any = ref([]);
      // 用于控制组件的数据同步
      const isShow = ref(false)
      // 获取子组件的的对象
      const flowEl = ref(null);
      const [registerDrawer, { openDrawer, closeDrawer }] = useDrawer();

      // 保存当前点击的接单信息
      const curNodeState = ref({});

      // 初始化
      async function init(){
        const res = await getNodeTemplateMenuApi();
        if(!res){
          return;
        }
        leftNodes.value = res
        isShow.value = true;
      }

      // 注册回调事件
      const nodeDbClickCallback = (ev) => {
        curNodeState.value = {
          id: ev.data.id,
          properties: ev.data.properties
        }

        console.log('click', ev.data.properties);
        // 获取对应的流程组件
        openDrawer(true, {
          title: ev.data.properties.drawTitle,  // set drawer title
          config: ev.data.properties.config,   // set rule node props
          values: ev.data.properties.setting    // set form values
        });
      }

      // 节点配置成功后的回调，更新节点名称
      function onInputDrawerSuccess(values: any){
        let flowChartEl: any = unref(flowEl);
        let lfInstance = flowChartEl?.lfInstance as LogicFlow;
        if(!flowChartEl || !unref(lfInstance)){
          return;
        }
        unref(curNodeState).properties.setting = values;
        // 更新属性
        lfInstance.setProperties(unref(curNodeState).id, unref(curNodeState).properties);
        // 更新文本
        if(values.nodeName){
          lfInstance.updateText(unref(curNodeState).id, values.nodeName);
        }

        closeDrawer();
      }

      // 边的添加事件
      const edgeAddedCallback = (data) => {
        console.log('edge add success', data);
      }

      // 边的双击事件
      const edgeDbClickCallback = (data) => {
        console.log('edge dbclick ', data);
      }
      onMounted(init);
      return {
        prefixCls: 'rule-page',
        leftNodes,
        isShow ,
        flowEl,
        nodeDbClickCallback,
        edgeAddedCallback,
        edgeDbClickCallback,
        registerDrawer,
        onInputDrawerSuccess
      };
    },
  });
</script>


<style lang="less">
  .rule-page {
    .vben-page-wrapper-content{
      margin: 0;
    }
  }
</style>
