<template>
  <div class="h-full w-full analysisTelemetryContainer">
    <div class="h-full w-full" style="background-color: #fff">
      <div class="analysisHeader">
        <div class="title"><span>实时监控</span></div>
        <div class="timeSelect">
          <RadioGroup size="default" :value="currentTimeTag" :onChange="timeTagOnChange">
            <RadioButton value="hour">时</RadioButton>
            <RadioButton value="day">天</RadioButton>
            <RadioButton value="month">月</RadioButton>
          </RadioGroup>
        </div>
        <div class="fields">
          <Select mode="multiple"
                  bordered="false"
                  allowClear
                  :options="fieldSelectOptions"
                  placeholder="请选择属性"
                  :onChange="fieldsOnChange"
                  style="width: 300px;"></Select>
        </div>
      </div>
      <Row>
        <Col span="16" style="padding-right: 15px">
          <div ref="chartLineRef" class="lineChartContainer" ></div>
        </Col>
        <Col span="8" style="padding-left: 15px;">
          <div ref="chartPieRef" class="lineChartContainer" ></div>
        </Col>
      </Row>
    </div>
  </div>

</template>

<script lang="ts">
  import {defineComponent, Ref, ref, onMounted, nextTick} from 'vue';
  import { Row, Col, RangePicker, Select, RadioGroup, RadioButton } from 'ant-design-vue';
  import { PageWrapper } from '/@/components/Page';
  import { useECharts } from '/@/hooks/web/useECharts';
  import { getAllAttributesByEntity } from "/@/api/things/attribute/attrApi";
  import {
    AttributeListItem
  } from "/@/api/things/attribute/model/attributeModel";
  import {
    DeviceHistoryTemplateSearch, HistoryTemplateResult,
  } from "/@/api/things/metrics/model/metricModel";
  import {getDeviceHistoryData} from "/@/api/things/metrics/metricApi";
  import moment from "moment";

  export default defineComponent({
    name: 'DeviceAnalysisComponent',
    components: {PageWrapper, Row, Col, RangePicker, Select, RadioGroup, RadioButton},
    props: ['deviceId'],
    setup(props) {
      const deviceId = props.deviceId;
      // 缓存设备对应的属性列表
      const deviceAttrs = ref<AttributeListItem[]>([]);
      const chartLineRef = ref<HTMLDivElement | null>(null);
      const chartPieRef = ref<HTMLDivElement | null>(null);
      const lineChart = useECharts(chartLineRef as Ref<HTMLDivElement>);
      const pieChart = useECharts(chartPieRef as Ref<HTMLDivElement>);
      // 下拉框数据
      const fieldSelectOptions = ref();
      // 当前选择的时间显示周期
      const currentTimeTag = ref('day');
      // 当前时间
      const currentTime = new Date().getTime();
      // 开始时间（默认一天）
      const startTimeRef = ref(currentTime - 1000 * 60 * 60 * 24);

      // 设备属性code
      let deviceAttributeCode = ref<string[]>([]);
      let deviceAttrNames = new Map();

      // 属性列表
      const dataAttributeLabels = ref<string[]>([]);
      // 横轴时间
      const dataTimes = ref<string[]>([]);
      // 历史数据
      const historyDataValue = ref<any[]>([]);
      // 统计每个属性上传的数据量
      const historyDataCount = ref<any[]>([]);

      async function init(){
        await nextTick();
        if(!chartLineRef.value){
          return;
        }
        // 加载属性
        getAllAttributesByEntity(deviceId, 'DEVICE').then((attrsList) => {
          fieldSelectOptions.value = [];
          if(attrsList && attrsList.length > 0){
            deviceAttrs.value = attrsList.filter(item => (item.valueType === 'LONG_V' || item.valueType === 'DOUBLE_V'));
            if(deviceAttrs.value){
              deviceAttrs.value.forEach(item => {
                deviceAttributeCode.value.push(item.code);
                deviceAttrNames.set(item.code, item.name);
                fieldSelectOptions.value.push({
                  label: item.name,
                  value: item.code
                });
              })
            }
            // 拉取数据
          }
          // 加载数据
          loadData();
        });
      }

      async function loadData(){
        if(!deviceAttributeCode.value){
          return;
        }
        const params = {
          entityId: deviceId,
          entityType: 'DEVICE',
          attrCommandType: 'ATTRIBUTE',
          fields: deviceAttributeCode.value,
          endTime: currentTime,
          startTime: startTimeRef.value,
        } as DeviceHistoryTemplateSearch;

        const originData = await getDeviceHistoryData(params);
        // 缓存
        formatHistoryData(originData);

        // 设置曲线图
        lineChart.setOptions({
          animationDuration: 3000,
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: dataAttributeLabels.value
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dataTimes.value
          },
          yAxis: {
            type: 'value'
          },
          series: historyDataValue.value
        });
      }

      // 处理数据
      const formatHistoryData = (historyData: HistoryTemplateResult[]) => {
          let dateTimeTemp = new Set<string>();
          dataAttributeLabels.value = [];
          historyDataValue.value = [];
          dataTimes.value = [];
          historyData.forEach(item => {
            // 获取全部无重复名称
            dataAttributeLabels.value.push(deviceAttrNames.get(item.key));
            let recordValues: number[] = [];
            if(item.items && item.items.length > 0){
              item.items.forEach(record => {
                dateTimeTemp.add(moment(Number(record.ts)).format('YYYY-MM-DD HH:mm:ss'));
                recordValues.push(record.value);
              })
            }
            if(recordValues.length > 0){
              historyDataValue.value.push({
                smooth: true,
                name: deviceAttrNames.get(item.key),
                type: 'line',
                stack: 'Total',
                data: recordValues
              });
            }
            renderPie();
        })

        dateTimeTemp.forEach(time => {
          dataTimes.value.push(time);
        })
      }

      function renderPie(){
        historyDataCount.value = [];
        if(historyDataValue.value && historyDataValue.value.length > 0){
          historyDataValue.value.forEach(item => {
            historyDataCount.value.push({
              value: item.data.length,
              name: item.name
            })
          })
        }

        pieChart.setOptions({
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            left: 'left'
          },
          series: [
            {
              name: '数量统计',
              type: 'pie',
              radius: '50%',
              data: historyDataCount.value,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      }

      function fieldsOnChange(fields: any){
        deviceAttributeCode.value = fields;
        loadData();
      }

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
        loadData();
      }

      onMounted(init);
      return {chartLineRef, chartPieRef, fieldSelectOptions, fieldsOnChange, timeTagOnChange, currentTimeTag};
    }
  });
</script>
<style lang="less">
  .analysisTelemetryContainer{
    padding-left: 10px;
    padding-right: 10px;
    .ant-row{
      width: 100%;
      height: 100%;
    }
    .analysisHeader{
      height: 32px;
      line-height: 32px;
      background-color: #fff;
      border-bottom: 1px solid #e8ebf3;

      .title{
        float: left;
        font-size: 14px;
        line-height: 32px;
        font-weight: bolder;
        margin-left: 20px;
        color: #989292;
      }
      .fields{
        float: right;
        line-height: 32px;
      }
      .timeSelect{
        float: right;
        line-height: 32px;
      }
    }
  }
  .lineChartContainer{
    width: 100%;
    height: 82%;
  }
</style>
