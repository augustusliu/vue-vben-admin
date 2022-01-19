<template>
  <FlowChart v-if="isShow" :patternItems="leftNodes"/>
</template>

<script lang="ts">
  import {FlowChart} from '/@/components/FlowChart';
  import {listAllLeftNodesApi} from '/@/api/things/ruler/ruleApi';
  import {onMounted, ref} from "vue";

  export default {
    components: { FlowChart },
    setup() {

      const leftNodes:any = ref([]);
      // 用于控制组件的数据同步
      const isShow = ref(false)

      async function init(){
        const res = await listAllLeftNodesApi();
        if(!res){
          return;
        }
        leftNodes.value = res
        isShow.value = true;
      }
      onMounted(init);
      return { leftNodes, isShow };
    },
  };
</script>
