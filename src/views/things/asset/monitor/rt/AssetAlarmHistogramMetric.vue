<template>
  <div class="h-full w-full assetAlarmContainer">
    <div class="h-full w-full assetAlarmHistogramContainer">
      <Row style="height:15% ;max-height: 32px">
        <Col span="24">
          <Row>
            <Col span="8"><span class="assetRtTitle"> 告警统计 </span></Col>
            <Col span="16">
              <RadioGroup size="default" :value="currentTimeTag" :onChange="timeTagOnChange" style="float: right;padding-right: 15px">
                <RadioButton value="day">天</RadioButton>
                <RadioButton value="month">月</RadioButton>
              </RadioGroup>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row style="min-height: 200px; height:85%; margin-top: 30px;">
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


      const currentTimeTag = ref('day');
      // 当前时间
      const currentTime = new Date().getTime();
      // 开始时间（默认一天）
      const startTimeRef = ref(currentTime - 1000 * 60 * 60 * 24);

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
              type: 'value'
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
    padding-left: 5px;
    padding-right: 5px;
    .assetAlarmHistogramContainer{
      background-color: #fff;
      width: 100%;
      height: 100%;

      .assetRealTimeHeader{
        height: 32px;
        line-height: 32px;
        background-color: #fff;
        border-bottom: 1px solid #e8ebf3;
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
    line-height: 32px;
    font-weight: bolder;
    margin-left: 20px;
    color: #989292;
  }
</style>
