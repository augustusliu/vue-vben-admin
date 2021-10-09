<template>
<!--  <PageWrapper-->
<!--    title="流程图"-->
<!--    content="简单流程图示例,具体功能需要自己完善"-->
<!--    contentFullHeight-->
<!--    fixedHeight-->
<!--  >-->
<!--    -->
<!--  </PageWrapper>-->
  <FlowChart :data="demoData" :patternItems="panelNodes"/>
</template>

<script lang="ts">
  import { FlowChart } from '/@/components/FlowChart';
  import demoData from './dataTurbo.json';
  import panelNodes from './patternNode.json';
  export default {
    components: { FlowChart },
    setup() {
      return { demoData, panelNodes };
    },
  };
</script>
