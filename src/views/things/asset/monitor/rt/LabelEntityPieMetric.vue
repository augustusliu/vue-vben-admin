<template>
  <div class="h-full w-full entityLabelMetricContainer">
    <div class="h-full w-full entityLabelPieContainer">
      <Row class="entityLabelPieHeader">
        <Col span="24"><span class="deviceLabelTitle"> 设备统计 </span></Col>
      </Row>
      <Row style="min-height: 200px; height:85%; margin-top: 30px;">
        <Col span="24">
          <div ref="deviceLabelPieChartContainerRef" style="width: 100%; height: 100%"></div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent, nextTick, onMounted, Ref, ref} from "vue";
  import {Col, Row} from "ant-design-vue";
  import {useECharts} from "/@/hooks/web/useECharts";
  import {getEntityLabelPieApi} from "/@/api/things/metrics/metricApi";

  export default defineComponent({
    name: 'LabelEntityPieComponent',
    components: {Row, Col},
    props: ['entityId', 'entityType'],
    setup(props){
      const entityId = props.entityId;
      const entityType = props.entityType;
      const deviceLabelPieChartContainerRef = ref<HTMLDivElement | null>(null);
      const deviceLabelPieChart = useECharts(deviceLabelPieChartContainerRef as Ref<HTMLDivElement>);
      // 加载数据
      async function loadPieData(){
        const pieData = await getEntityLabelPieApi(entityId, entityType);
        if(!pieData || pieData.length <= 0){
          return ;
        }

        let chartOptions = {
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: 'top'
          },
          series: [
            {
              type: 'pie',
              radius: ['40%', '70%'],
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
                  fontSize: '18',
                  fontWeight: 'bold'
                }
              },
              labelLine: {
                show: false
              },
              data: pieData
            }
          ]
        }
        deviceLabelPieChart.getInstance()?.clear();
        deviceLabelPieChart.getInstance()?.setOption(chartOptions);
      }

      async function init(){
        await nextTick();
        if(!deviceLabelPieChartContainerRef.value){
          return;
        }
        loadPieData();
      }

      onMounted(init)
      return { deviceLabelPieChartContainerRef }
    }
  });
</script>

<style lang="less">
  .entityLabelMetricContainer{
    width: 100%;
    height: 100%;
    padding-left: 5px;
    padding-right: 5px;
    .entityLabelPieContainer{
      background-color: #fff;
      width: 100%;
      height: 100%;

      .entityLabelPieHeader{
        height:15%;
        max-height: 32px;
        line-height: 32px;
        border-bottom: 1px solid #e8ebf3;
      }
    }
  }
  .ant-row{
    width: 100%;
    height: 100%;
  }
  .deviceLabelTitle{
    float: left;
    font-size: 14px;
    line-height: 32px;
    font-weight: bolder;
    margin-left: 20px;
    color: #989292;
  }
</style>
