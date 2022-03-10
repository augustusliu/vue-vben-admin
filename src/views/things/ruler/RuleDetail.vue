<template>
  <PageWrapper
    contentFullHeight
    fixedHeight
    :class="prefixCls">
      <FlowChart v-if="isShow"
                 ref="flowEl"
                 :patternItems="leftNodes"
                 :data="logicFlowData"
                 :nodeDbClickCallback="nodeDbClickCallback"
                 @submitBefore="chainSaveBefore"
      />
    <DynamicNodeDrawer @register="registerDrawer"
                       @success="handleNodeSettingSuccess"/>

    <RuleDetailModel @register="registerModel" @success="handleChainNameSuccess"></RuleDetailModel>
  </PageWrapper>
</template>

<script lang="ts">
  import { FlowChart } from '/@/components/FlowChart';
  import {defineComponent, nextTick, onMounted, ref, unref} from "vue";
  import DynamicNodeDrawer from './DynamicNodeDrawer.vue';
  import {useDrawer} from "/@/components/Drawer";
  import LogicFlow from "@logicflow/core";
  import ruleNodeMenu from './rule_node_menu.json'
  import { formatGraphData } from './ruleEvent'
  import { saveChainApi, chainInfoApi } from '/@/api/things/ruler/ruleApi';
  import {useModal} from "/@/components/Modal";
  import RuleDetailModel from './RuleDetailModel.vue';
  import { useRoute } from 'vue-router';
  import { Loading, useLoading } from '/@/components/Loading';

  export default defineComponent({
    name: 'RuleDetail',
    components: { FlowChart , DynamicNodeDrawer, RuleDetailModel, Loading },
    setup() {
      const route = useRoute();

      const leftNodes:any = ref([]);
      // 用于控制组件的数据同步
      const isShow = ref(false)
      // 获取子组件的的对象
      const flowEl = ref(null);
      // 当前的规则链id
      const chainId: any = ref(route.params?.id).value;
      const isUpdate: boolean = !!(chainId && Number(chainId) > 0);
      // 待保存的规则链数据
      const ruleSaveDataCache: any = ref({});
      // 如果是更新操作，则保存原始记录
      const logicFlowData: any = ref({});
      // 保存当前点击的节点信息
      const curNodeState: any = ref({});
      // 保存规则链名称等信息
      const currentChainInfoModel: any = ref({});
      const [openFullLoading, closeFullLoading] = useLoading({});
      const [registerModel, { openModal, closeModal }] = useModal();
      const [registerDrawer, { openDrawer, closeDrawer }] = useDrawer();

      // 初始化
      async function init(){
        await nextTick();
        // const res = await getNodeTemplateMenuApi();
        // 初始化左侧节点菜单
        openFullLoading();
        const res = ruleNodeMenu;
        if(!res){
          return;
        }
        leftNodes.value = res

        // 如果是更新，初始化界面流程图
        if(isUpdate){
          const ruleChainData: any = await chainInfoApi(chainId);
          if(!ruleChainData){
            return ;
          }
          logicFlowData.value.nodes = ruleChainData.nodes;
          logicFlowData.value.edges = ruleChainData.edges;

          currentChainInfoModel.value.ruleChainName = ruleChainData.ruleChainName;
          currentChainInfoModel.value.description = ruleChainData.description;
        }
        isShow.value = true;
        closeFullLoading();
      }

      // 注册回调事件
      const nodeDbClickCallback = (ev) => {
        curNodeState.value = {
          id: ev.data.id,
          properties: ev.data.properties
        }
        // 获取对应的流程组件
        openDrawer(true, {
          title: ev.data.properties.drawTitle,  // set drawer title
          config: ev.data.properties.config,   // set rule node props
          values: ev.data.properties.setting,    // set form values
        });
      }

      // 提交流程数据
      function chainSaveBefore(graphData: any){
        const { data } = graphData;
        ruleSaveDataCache.value = formatGraphData({
          data: data,
        });
        openModal(true, currentChainInfoModel.value);
      }

      // 节点配置成功后的回调，更新节点名称
      function handleNodeSettingSuccess(values: any){
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

      // 处理规则链名称编辑
      function handleChainNameSuccess( values ){
        ruleSaveDataCache.value.ruleChainName = values.ruleChainName;
        ruleSaveDataCache.value.description = values.description;
        // 保存到规则链名称中
        currentChainInfoModel.value.ruleChainName = values.ruleChainName;
        currentChainInfoModel.value.description = values.description;
        doSaveChain();
        closeModal();
      }

      async function doSaveChain(){
        openFullLoading();
        ruleSaveDataCache.value.id = (chainId && Number(chainId) > 0) ? chainId : null;
        await saveChainApi(ruleSaveDataCache.value);
        ruleSaveDataCache.value = {};
        closeFullLoading();
      }
      onMounted(init);
      return {
        prefixCls: 'rule-page',
        leftNodes,
        logicFlowData,
        isShow ,
        flowEl,
        nodeDbClickCallback,
        registerModel,
        registerDrawer,
        handleNodeSettingSuccess,
        chainSaveBefore,
        handleChainNameSuccess,
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
