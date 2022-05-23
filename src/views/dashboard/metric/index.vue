<template>
  <div class="p-4">
    <MetricCard class="enter-y" />
    <div class="md:flex enter-y things-metric-chart-container">
      <TransportMetricPie height="240px" class="md:w-1/3 w-full things-mr"/>
      <DeviceLabelPie height="240px" class="md:w-1/3 w-full things-mr things-ml" />
      <AlarmTypeMetricPie height="240px" class="md:w-1/3 w-full things-ml" />
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
      return { loading };
    },
  });
</script>

<style lang="less">

  .things-metric-chart-container{
    margin-top: 15px;
    .ant-card-head{
      font-size: 14px;
    }
  }
  .things-mr{
    margin-right: 10px;
  }
  .things-ml{
    margin-left: 10px;
  }
</style>
