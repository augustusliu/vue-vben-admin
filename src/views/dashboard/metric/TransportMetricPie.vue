<template>
  <Card title="设备接入协议" :loading="loading">
    <div ref="chartRef" :style="{ width, height }"></div>
  </Card>
</template>
<script lang="ts">
  import {defineComponent, onMounted, Ref, ref} from 'vue';
  import { Card } from 'ant-design-vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import {getDeviceTransportPie} from "/@/api/things/metrics/metricApi";

  export default defineComponent({
    name: 'TransportMetricPie',
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
        const res = await getDeviceTransportPie();
        if(!res){
          return;
        }
        setOptions({
          tooltip: {
            trigger: 'item',
          },
          legend: {
            bottom: '1%',
            left: 'center',
          },
          colorBy: 'series',
          color: [
            "#ea7ccc",
            "#9a60b4",
            "#fc8452",
            "#3ba272",
            "#73c0de",
            "#ee6666",
            "#fac858",
            "#91cc75",
            "#5470c6"
          ],
          series: [
            {
              name: "设备协议接入",
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2,
              },
              label: {
                show: false,
                position: 'center',
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '12',
                  fontWeight: 'bold',
                },
              },
              labelLine: {
                show: false,
              },
              data: res,
              animationType: 'scale',
              animationEasing: 'exponentialInOut',
              animationDelay: function () {
                return Math.random() * 100;
              },
            },
          ],
        });
        loading.value = false;
      }

      onMounted(init);
      return { chartRef, loading};
    },
  });
</script>
