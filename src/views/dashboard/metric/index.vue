<template>
  <div class="p-4">
    <MetricCard class="enter-y" />

    <div class="md:flex enter-y" style="margin-top: 15px">
      <TransportMetricPie class="md:w-1/3 w-full"/>
      <DeviceLabelPie class="md:w-1/3 w-full"/>
      <AlarmTypeMetricPie class="md:w-1/3 w-full"/>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import MetricCard from './MetricCard.vue';
  import TransportMetricPie from './TransportMetricPie.vue';
  import AlarmTypeMetricPie from "./AlarmTypeMetricPie.vue";
  import DeviceLabelPie from "./DeviceLabelPie.vue";

  export default defineComponent({
    name: 'DashboardMetric',
    components: {
      MetricCard, TransportMetricPie, AlarmTypeMetricPie, DeviceLabelPie
    },
    setup() {
      const loading = ref(true);
      // setTimeout(() => {
      //   loading.value = false;
      // }, 1500);

      return { loading };
    },
  });
</script>
