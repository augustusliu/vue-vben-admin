<template>
  <div class="p-4">
    <GrowCard :loading="loading" class="enter-y" />
    <SiteAnalysis class="!my-4 enter-y" :loading="loading" />

    <div class="md:flex enter-y">
      <div class="md:w-1/3  w-full metricCard" style="padding: 10px 10px">
        <VisitRadar :loading="loading" />
      </div>

      <VisitSource class="md:w-1/3  metricCard" :loading="loading" />
      <SalesProductPie class="md:w-1/3 metricCard" :loading="loading" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import GrowCard from './components/GrowCard.vue';
  import SiteAnalysis from './components/SiteAnalysis.vue';
  import VisitSource from './components/VisitSource.vue';
  import VisitRadar from './components/VisitRadar.vue';
  import SalesProductPie from './components/SalesProductPie.vue';

  export default defineComponent({
    components: {
      GrowCard,
      SiteAnalysis,
      VisitRadar,
      VisitSource,
      SalesProductPie,
    },
    setup() {
      const loading = ref(true);

      setTimeout(() => {
        loading.value = false;
      }, 1500);
      return { loading };
    },
  });
</script>

<style lang="less">
  .metricCard{
    margin-left: 4px !important;
    margin-right: 4px !important;
  }
</style>
