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
    <DynamicNodeDrawer @register="registerDrawer" @success="onInputDrawerSuccess"/>
  </PageWrapper>
</template>

<script lang="ts">
  import { FlowChart } from '/@/components/FlowChart';
  import { getNodeTemplateMenuApi } from '/@/api/things/ruler/ruleApi';
  import { defineComponent, onMounted, ref, unref } from "vue";
  import DynamicNodeDrawer from './DynamicNodeDrawer.vue';
  import {useDrawer} from "/@/components/Drawer";

  export default defineComponent({
    name: 'RuleDetail',
    components: { FlowChart , DynamicNodeDrawer },
    setup() {
      const leftNodes:any = ref([]);
      // 用于控制组件的数据同步
      const isShow = ref(false)
      // 获取子组件的的对象
      const flowEl = ref(null);
      const [registerDrawer, { openDrawer: openInputDrawer }] = useDrawer();
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
        let flowChartEl: any = unref(flowEl);
        let lfInstance = flowChartEl?.lfInstance;
        if(!flowChartEl || !unref(lfInstance)){
          return;
        }
        // 获取对应的流程组件
        openInputDrawer(true, {
          title: ev.data.properties.drawTitle,
          settings: ev.data.properties.config
        });
      }

      function onInputDrawerSuccess(){

      }

      const edgeAddedCallback = (data) => {
        console.log('edge add success', data);
      }

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
        onInputDrawerSuccess,
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
