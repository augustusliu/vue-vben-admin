<template>
  <div class="h-full w-full alarmAnalysisContainer">
    <div class="h-full w-full" style="background-color: #fff">
      <div class="alarmAnalysisHeader">
        <div class="title"><span>告警监控</span></div>
      </div>
      <Row>
        <Col span="24">
          <div ref="alarmChartRef" class="alarmChartContainer"></div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script lang="ts">
  import {defineComponent, ref, onMounted, nextTick, Ref} from 'vue';
  import { Row, Col,} from 'ant-design-vue';
  import { getAlarmsGroupByTypeApi } from "/@/api/things/metrics/metricApi";
  import {useECharts} from "/@/hooks/web/useECharts";
  export default defineComponent({
    name: 'DeviceAnalysisAlarmLineGroup',
    components: {Row, Col},
    props: ['deviceId'],
    setup(props){
      const deviceId = props.deviceId;
      const alarmChartRef =  ref<HTMLDivElement | null>(null);
      const alarmChart = useECharts(alarmChartRef as Ref<HTMLDivElement>);

      const alarmCurrentTime = new Date().getTime();
      const alarmStartTimeRef = ref(alarmCurrentTime - 1000*60*60*30);
      // 缓存告警数据
      const alarmGroupCacheRef = ref<any[]>([]);
      // pieData
      const alarmPieDataRef = ref<any[]>([]);

      async function loadAlarmData(){
        alarmPieDataRef.value = [];
        alarmGroupCacheRef.value = [];
        const alarms = await getAlarmsGroupByTypeApi({
          entityId: deviceId,
          entityType: 'DEVICE',
          endTime: alarmCurrentTime,
          startTime: alarmStartTimeRef.value
        });

        if(alarms && alarms.length > 0){
          alarmGroupCacheRef.value = alarms;
          alarms.forEach(record => {
            // 获取横坐标
            alarmPieDataRef.value.push({
              value: (!record.items || record.items.length <= 0 ) ? 0:record.items.length,
              name: record.alarmType
            });
          })
        }
        // 设置参数
        alarmChart.setOptions({
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: ['40%', '70%'],
              avoidLabelOverlap: false,
              itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
              },
              label: {
                show: false,
                position: 'center'
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: '40',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: alarmPieDataRef.value
            }
          ]
        })
      }

      async function init(){
        await nextTick();
        if(!alarmChartRef.value){
          return;
        }
        await loadAlarmData();
      }
      onMounted(init);
      return { alarmChartRef };
    }
  });
</script>
<style lang="less">
  .alarmAnalysisContainer{
    padding-left: 10px;
    padding-right: 10px;
    .alarmAnalysisHeader{
      height: 38px;
      line-height: 38px;
      background-color: #fff;
      border-bottom: 1px solid #e8ebf3;
      .title{
        float: left;
        font-size: 14px;
        line-height: 38px;
        font-weight: bolder;
        margin-left: 20px;
        color: #989292;
      }
    }
  }
  .alarmChartContainer{
    width: 100%;
    height: 82%;
  }
  .ant-row{
    width: 100%;
    height: 100%;
  }
</style>
