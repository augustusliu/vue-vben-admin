<template>
  <Card title="报警类型" :loading="loading">
    <div ref="chartRef" :style="{ width, height }"></div>
  </Card>
</template>
<script lang="ts">
  import {defineComponent, onMounted, Ref, ref} from 'vue';
  import { Card } from 'ant-design-vue';
  import { useECharts } from '/@/hooks/web/useECharts';
  import {getAlarmTypePie} from "/@/api/things/metrics/metricApi";

  export default defineComponent({
    name: 'AlarmTypePie',
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
        const res = await getAlarmTypePie();
        if(!res){
          return;
        }
        setOptions({
          tooltip: {
            trigger: 'item',
          },
          legend: {
            top: 'bottom'
          },
          series: [
            {
              name: '报警类型',
              type: 'pie',
              radius: '50%',
              data: res,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
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
