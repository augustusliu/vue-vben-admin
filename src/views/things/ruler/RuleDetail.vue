<template>
  <FlowChart v-if="isShow" :patternItems="leftNodes" :nodeDbClickCallback="nodeDbClickCallback"
             :addEdgeClickCallback="edgeAddedCallback" :edgeDbClickCallback="edgeDbClickCallback"/>
</template>

<script lang="ts">
  import {FlowChart} from '/@/components/FlowChart';
  import {getNodeTemplateMenuApi} from '/@/api/things/ruler/ruleApi';
  import {onMounted, ref} from "vue";

  export default {
    name: 'RuleDetail',
    components: { FlowChart },
    setup() {
      const leftNodes:any = ref([]);
      // 用于控制组件的数据同步
      const isShow = ref(false)
      async function init(){
        const res = await getNodeTemplateMenuApi();
        if(!res){
          return;
        }
        leftNodes.value = res
        isShow.value = true;
      }

      // 注册回调事件
      const nodeDbClickCallback = (data) => {
        console.log('node dbclick', data);
      }

      const edgeAddedCallback = (data) => {
        console.log('edge add success', data);
      }

      const edgeDbClickCallback = (data) => {
        console.log('edge dbclick ', data);
      }


      onMounted(init);
      return { leftNodes, isShow ,nodeDbClickCallback, edgeAddedCallback, edgeDbClickCallback };
    },
  };
</script>
