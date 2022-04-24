<template>
  <Card title="设备标签" :loading="loading">
    <div ref="chartRef" :style="{ width, height }"></div>
  </Card>
</template>
<script lang="ts">
  import {defineComponent, onMounted, Ref, ref} from 'vue';
  import { Card } from 'ant-design-vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import {getDeviceLabelPie} from "/@/api/things/metrics/metricApi";

  export default defineComponent({
    name: 'DeviceLabelPie',
    components: { Card },
    props: {
      loading: Boolean,
      width: {
        type: String as PropType<string>,
        default: '100%',
      },
      height: {
        type: String as PropType<string>,
        default: '300px',
      }
    },
    setup() {
      const chartRef = ref<HTMLDivElement | null>(null);
      const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);

      const loading = ref(true);

      async function init(){
        const res = await getDeviceLabelPie();
        let labelNames: string[] = [];
        let labelValue: number[] = [];
        if(res){
          res.forEach(item => {
            labelNames.push(item.name);
            labelValue.push(item.value);
          });
        }
        setOptions({
          xAxis: {
            type: 'category',
            data: labelNames,
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: labelValue,
              type: 'bar'
            }
          ]
        });
        loading.value = false;
      }

      onMounted(init);
      return { chartRef, loading};
    },
  });
</script>
