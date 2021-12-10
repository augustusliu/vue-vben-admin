<template>
  <FlowChart :patternItems="panelNodes"/>
</template>

<script lang="ts">
  import { FlowChart } from '/@/components/FlowChart';
  import panelNodes from './patternNode.json';
  export default {
    components: { FlowChart },
    setup() {
      return { panelNodes };
    },
  };
</script>
