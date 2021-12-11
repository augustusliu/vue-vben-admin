<template>
  <FlowChart :patternItems="panelNodes"/>
</template>

<script lang="ts">
  import thingsRuler from './ThingsRuler.vue';
  import panelNodes from './patternNode.json';
  export default {
    components: { thingsRuler },
    setup() {
      return { panelNodes };
    },
  };
</script>
