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
                 :ruleChainActive="ruleChainActive"
                 @submitBefore="chainSaveBefore"
                 @debugChange="ruleChainDebugChange"
      />
    <DynamicNodeDrawer @register="registerDrawer"
                       @success="handleNodeSettingSuccess"/>
    <RuleDebugInfoDrawer @register="registerDebugDrawer" :ruleChainId="chainId"/>
    <RuleDetailModel @register="registerModel" @success="handleChainNameSuccess"></RuleDetailModel>
  </PageWrapper>
</template>

<script lang="ts">
  import { FlowChart } from '/@/components/FlowChart';
  import {defineComponent, nextTick, onMounted, ref, unref} from "vue";
  import DynamicNodeDrawer from './DynamicNodeDrawer.vue';
  import RuleDebugInfoDrawer from "./RuleDebugInfoDrawer.vue";
  import {useDrawer} from "/@/components/Drawer";
  import LogicFlow from "@logicflow/core";
  import ruleNodeMenu from './rule_node_menu.json'
  import { formatGraphData } from './ruleEvent'
  import { saveChainApi, chainInfoApi, debugChangeApi ,stopChangeApi} from '/@/api/things/ruler/ruleApi';
  import {useModal} from "/@/components/Modal";
  import RuleDetailModel from './RuleDetailModel.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Loading, useLoading } from '/@/components/Loading';
  import { useMultipleTabStore } from '/@/store/modules/multipleTab';

  export default defineComponent({
    name: 'RuleDetail',
    components: { FlowChart , DynamicNodeDrawer, RuleDebugInfoDrawer, RuleDetailModel, Loading },
    setup() {
      const route = useRoute();
      const router = useRouter();
      const tabStore = useMultipleTabStore();
      const leftNodes:any = ref([]);
      // 规则链是否启动
      const ruleChainActive = ref(false);
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

      let ruleToolBarCallBack: any = null;
      const [openFullLoading, closeFullLoading] = useLoading({});
      const [registerModel, { openModal, closeModal }] = useModal();
      const [registerDrawer, { openDrawer, closeDrawer }] = useDrawer();
      const [registerDebugDrawer, { openDrawer: openDebugDrawer, closeDrawer: closeDebugDrawer }] = useDrawer();
      openFullLoading();

      // 初始化
      async function init(){
        await nextTick();
        // const res = await getNodeTemplateMenuApi();
        // 初始化左侧节点菜单
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
          ruleChainActive.value = ruleChainData.active;
          logicFlowData.value.nodes = ruleChainData.nodes;
          logicFlowData.value.edges = ruleChainData.edges;

          currentChainInfoModel.value.ruleChainName = ruleChainData.ruleChainName;
          currentChainInfoModel.value.description = ruleChainData.description;
          await tabStore.updateTabTitle(ruleChainData.ruleChainName, router.currentRoute.value);
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
          nodeFixId: ev.data.properties.fixId,
          title: ev.data.properties.drawTitle,  // set drawer title
          values: ev.data.properties.setting,    // set form values
        });
      }

      // 提交流程数据
      function chainSaveBefore(graphData: any){
        const { type, data, callback } = graphData;

        ruleToolBarCallBack = callback;
        // 部署
        if(type){
          let obj = formatGraphData({
            data: data,
          });
          ruleSaveDataCache.value = JSON.parse(JSON.stringify(obj));
          openModal(true, currentChainInfoModel.value);
        }else{  // 停止
          openFullLoading();
          stopChangeApi(chainId).then(() => {
            callback(true);
          }).catch(() => {
            callback(false);
          }).finally(() => {
            closeFullLoading();
          });
        }
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
        // 查找到对应的业务节点名称,用于自定义
        Object.keys(values).map(item => {
          if(item.endsWith('NodeName') && values[item]){
            lfInstance.updateText(unref(curNodeState).id, values[item]);
          }
        })
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
        if(ruleToolBarCallBack){
          ruleToolBarCallBack(true);
          closeFullLoading();
        }
      }

      async function doSaveChain(){
        openFullLoading();
        ruleSaveDataCache.value.id = (chainId && Number(chainId) > 0) ? chainId : null;
        const newChainId = await saveChainApi(ruleSaveDataCache.value);
        ruleSaveDataCache.value = {};
        // 如果是新建，创建成功后跳转到最新的地址
        if(!isUpdate){
          await tabStore.updateTabPathByType('/rule_detail/' + newChainId, '/rule_detail/-1', router);
        }
        closeFullLoading();
      }

      function ruleChainDebugChange(state: boolean, debugCallback: any){
        openFullLoading();
        const curChainId = (chainId && Number(chainId) > 0) ? chainId : null;
        debugChangeApi(curChainId, state).then(() => {
          // 弹出调试弹框
          if(state){
            openDebugDrawer(true, {
              ruleChainName: currentChainInfoModel.value.ruleChainName
            });
          }
          debugCallback(true)
        }).catch(() => {
          debugCallback(false)
        }).finally(() => {
          closeFullLoading();
        });
      }


      onMounted(init);
      return {
        prefixCls: 'rule-page',
        leftNodes,
        chainId,
        logicFlowData,
        ruleChainActive,
        isShow ,
        flowEl,
        nodeDbClickCallback,
        registerModel,
        registerDrawer,
        registerDebugDrawer,
        handleNodeSettingSuccess,
        chainSaveBefore,
        handleChainNameSuccess,
        ruleChainDebugChange,
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
