<template>
  <div class="h-full w-full assetAlarmContainer">
    <div class="h-full w-full assetAlarmHistogramContainer">
      <Row class="assetAlarmRealTimeHeader">
        <Col span="24">
          <Row>
            <Col span="8"><span class="assetRtTitle"> 告警统计 </span></Col>
            <Col span="16">
              <RadioGroup size="default" :value="currentTimeTag" :onChange="timeTagOnChange" style="float: right;padding-right: 10px; opacity: 0.7">
                <RadioButton value="day">天</RadioButton>
                <RadioButton value="month">月</RadioButton>
              </RadioGroup>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style="min-height: 160px; height:90%; margin-top: 10px;">
        <Col span="24">
          <div ref="assetAlarmChartRef" style="width: 100%; height: 100%"></div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script lang="ts">

  import {defineComponent, Ref, ref, onMounted, nextTick} from "vue";
  import {Col, Row, RadioGroup, RadioButton} from "ant-design-vue";
  import {useECharts} from "/@/hooks/web/useECharts";
  import {getAlarmMetricByTypeAndTimeApi} from "/@/api/things/metrics/metricApi";

  export default defineComponent({
    name: 'AssetAlarmHistogramComponent',
    components: {Row, Col, RadioGroup, RadioButton},
    props: ['entityId', 'entityType'],
    setup(props){
      const entityId = props.entityId;
      const entityType = props.entityType;
      const assetAlarmChartRef = ref<HTMLDivElement | null>(null);
      const assetHistogramChart = useECharts(assetAlarmChartRef as Ref<HTMLDivElement>);

      const currentTimeTag = ref('month');
      // 当前时间
      const currentTime = new Date().getTime();
      // 开始时间（默认一天）
      const startTimeRef = ref(currentTime - 1000 * 60 * 60 * 24 *30);

      // 时间周期切换
      function timeTagOnChange(e){
        const timeTag = e.target.value;
        currentTimeTag.value = timeTag;
        if(timeTag === 'hour'){
          startTimeRef.value = currentTime - 1000 * 60 * 60;
        }else if(timeTag === 'month'){
          startTimeRef.value = currentTime - 1000 * 60 * 60 * 24 * 30;
        }else{
          startTimeRef.value = currentTime - 1000 * 60 * 60 * 24;
        }
        loadAlarms();
      }

      async function loadAlarms(){
        const alarmsData = await getAlarmMetricByTypeAndTimeApi({
          entityId: entityId,
          entityType: entityType,
          periodType: currentTimeTag.value,
          startTime: startTimeRef.value,
          endTime: currentTime,
        });

        if(!alarmsData){
          return;
        }

        let seriesObj:any[] = [];

        if(alarmsData && alarmsData.data && alarmsData.data.length >0 ){
          alarmsData.data.forEach(item => {
            seriesObj.push({
              name: item.labelName,
              type: 'bar',
              barWidth: 20,
              data: item.values,
            });
          })
        }


        let chartOptions = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            }
          },
          legend: {
            data: alarmsData.labels,
            left: '15',
            textStyle: {
              color: '#989292',
            }
          },
          xAxis: [
            {
              type: 'category',
              axisTick: { show: false },
              data: alarmsData.category
            }
          ],
          yAxis: [
            {
              type: 'value',
              interval: 30,
              show: true,
              splitLine:{
                show: false
              }
            }
          ],
          series: seriesObj
        }
        assetHistogramChart.getInstance()?.clear();
        assetHistogramChart.getInstance()?.setOption(chartOptions);
      }

      async function init(){
        await nextTick();
        if(!assetAlarmChartRef.value){
          return;
        }
        loadAlarms();
      }

      onMounted(init)
      return {currentTimeTag , timeTagOnChange, assetAlarmChartRef}
    }
  });
</script>

<style lang="less">
  .assetAlarmContainer{
    width: 100%;
    height: 100%;
    .assetAlarmHistogramContainer{
      /*background-color: #fff;*/
      width: 100%;
      height: 100%;
      .assetAlarmRealTimeHeader{
        height: 28px;
        line-height: 28px;
        border-left: 3px solid #80ff00;
      }
    }
  }
  .ant-row{
    width: 100%;
    height: 100%;
  }
  .assetRtTitle{
    float: left;
    font-size: 14px;
    line-height: 28px;
    font-weight: bolder;
    margin-left: 20px;
    color: #989292;
  }
</style>
