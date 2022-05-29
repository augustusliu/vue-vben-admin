<template>
  <!-- 资产实时数据组件，包含资产在一定时间内的实时曲线，相关设备统计信息 -->
  <div class="h-full w-full assetRealTimeLineContainer">
    <div class="realtimeLineContentContainer">
      <Row class="assetRealTimeLineHeader">
        <Col span="24">
          <Row>
            <Col span="6"><span class="assetRtTitle"> 实时监控 </span></Col>
            <Col span="18">
              <RadioGroup size="default" :value="currentTimeTag" :onChange="timeTagOnChange" class="assetLineBtnGroup">
                <RadioButton value="hour">时</RadioButton>
                <RadioButton value="day">天</RadioButton>
                <RadioButton value="month">月</RadioButton>
              </RadioGroup>
              <Select mode="multiple"
                      bordered="false"
                      allowClear
                      :options="attributeOptionsRef"
                      placeholder="请选择属性"
                      :onChange="attributeOnChange" style="min-width: 120px;float: right;" />
              <Select bordered="false"
                      allowClear
                      :options="deviceListsRef"
                      :value="currentDeviceValue"
                      placeholder="请选择设备"
                      :onChange="deviceOnChange"
                      style="min-width: 120px;float: right;" />
            </Col>
          </Row>
        </Col>
      </Row>
      <!-- 实时数据展示 -->
      <Row style="min-height:160px; height:90%">
        <Col span="24" xl="24" md="24" sm="24">
          <div ref="deviceRtChartRef" style="width: 100%; height: 100%"></div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<script lang="ts">
  import {defineComponent, nextTick, Ref, ref, onMounted} from "vue";
  import { Row, Col, Select, RadioGroup, RadioButton} from 'ant-design-vue';
  import {AssetRealtimeService} from "/@/views/things/asset/monitor/rt/AssetRealtimeService";
  import {useECharts} from "/@/hooks/web/useECharts";
  import {
    DeviceHistoryTemplateSearch,
    HistoryTemplateResult
  } from "/@/api/things/metrics/model/metricModel";
  import {getDeviceHistoryData} from "/@/api/things/metrics/metricApi";
  import {thingsWebSocket, WebResponse} from "/@/layouts/default/header/ws/ThingsWebSocket";
  import moment from "moment";

  const maxItems = 100;
  export default defineComponent({
    name: 'AssetRealtimeLineComponent',
    components: {Row, Col, Select, RadioGroup, RadioButton},
    props: ['entityId'],
    setup(props){
      const deviceListsRef = ref<any[]>([]);
      const attributeOptionsRef = ref([]);
      const currentDeviceValue = ref();
      // 当期的时间tag
      const currentTimeTag = ref('month');
      // 设备实时曲线
      const deviceChartOptionsRef = ref();
      const deviceRtChartRef = ref<HTMLDivElement | null>(null);
      const deviceChart = useECharts(deviceRtChartRef as Ref<HTMLDivElement>);

      const deviceFields = ref<any[] | undefined>([]);

      // 当前时间
      const currentTime = new Date().getTime();
      // 开始时间（默认一月）
      const startTimeRef = ref(currentTime - 1000 * 60 * 60 * 24 * 30);
      // 数据缓存
      const deviceHistoryDataRef = ref<any[]>([]);
      const deviceHistoryDataTimeRef = ref<string[]>([]);
      const deviceAttrNameMapRef = ref<any>();
      // 初始化rtService
      const rtServiceRef = ref<AssetRealtimeService>();

      // 设备信息更新后的回调函数
      function deviceUpdateCallback(deviceList){
        deviceListsRef.value = deviceList;
        if(deviceList && deviceList.length > 0){
          currentDeviceValue.value = deviceList[0].value;
        }
        // 更新设备属性
        attributeOptionsRef.value = rtServiceRef.value?.getFieldsByDeviceId(currentDeviceValue.value);
        deviceAttrNameMapRef.value = rtServiceRef.value?.getFieldNameMapByDevice(currentDeviceValue.value);
        deviceFields.value = rtServiceRef.value?.getFieldCodesByDevice(currentDeviceValue.value);
        loadDeviceData();
      }

      function deviceOnChange(deviceId: any){
        currentDeviceValue.value = deviceId;
        resetValues();
        // 更新设备属性
        deviceFields.value = rtServiceRef.value?.getFieldCodesByDevice(currentDeviceValue.value);
        attributeOptionsRef.value = rtServiceRef.value?.getFieldsByDeviceId(currentDeviceValue.value);
        deviceAttrNameMapRef.value = rtServiceRef.value?.getFieldNameMapByDevice(currentDeviceValue.value);
        loadDeviceData();
      }

      function attributeOnChange(fields: any){
        if(!fields || fields.length <= 0){
          deviceFields.value = rtServiceRef.value?.getFieldCodesByDevice(currentDeviceValue.value);
        }else{
          deviceFields.value = fields;
        }
        deviceHistoryDataTimeRef.value = [];
        deviceHistoryDataRef.value = [];
        loadDeviceData();
      }

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
        deviceHistoryDataTimeRef.value = [];
        deviceHistoryDataRef.value = [];
        loadDeviceData();
      }

      async function loadDeviceData(){
        if(!currentDeviceValue.value){
          return;
        }

        const params = {
          entityId: currentDeviceValue.value,
          entityType: 'DEVICE',
          attrCommandType: 'ATTRIBUTE',
          fields: deviceFields.value,
          endTime: currentTime,
          startTime: startTimeRef.value,
        } as DeviceHistoryTemplateSearch;

        const originData = await getDeviceHistoryData(params);
        // 缓存
        formatHistoryData(originData);
        // 刷新曲线

        deviceChartOptionsRef.value.legend.data = rtServiceRef.value?.getFieldNamesByDevice(currentDeviceValue.value);
        deviceChartOptionsRef.value.xAxis.data = deviceHistoryDataTimeRef.value;
        deviceChartOptionsRef.value.series = deviceHistoryDataRef.value;
        deviceChart.getInstance()?.clear();
        deviceChart.getInstance()?.setOption(deviceChartOptionsRef.value);
      }

      // 清空监控数据
      function resetValues(){
        deviceFields.value = [];
        attributeOptionsRef.value = [];
        deviceHistoryDataTimeRef.value = [];
        deviceHistoryDataRef.value = [];
        deviceAttrNameMapRef.value = [];
      }

      // 格式化数据
      const formatHistoryData = (historyData: HistoryTemplateResult[]) => {
        let dateTimeTemp = new Set<string>();
        deviceHistoryDataTimeRef.value = [];
        let count = 0;
        historyData.forEach(item => {
          if(count <= maxItems){
            let recordValues: number[] = [];
            if(item.items && item.items.length > 0){
              item.items.forEach(record => {
                dateTimeTemp.add(moment(Number(record.ts)).format('YYYY-MM-DD HH:mm:ss'));
                recordValues.push(record.value);
              })
            }
            if(recordValues.length > 0){
              deviceHistoryDataRef.value.push({
                smooth: true,
                name: deviceAttrNameMapRef.value.get(item.key),
                type: 'line',
                stack: 'Total',
                data: recordValues
              });
            }
          }
          count ++;
        })
        dateTimeTemp.forEach(time => {
          deviceHistoryDataTimeRef.value.push(time);
        })
      }

      // 开启ws
      thingsWebSocket.updateCallback({
        deviceAttributeCallbackFunc: assetAttributeRealTimeCallback
      });

      function assetAttributeRealTimeCallback(wsResp: WebResponse){
        let assetId = wsResp.assetId;
        let wsEntityId = wsResp.entityId;
        // 如果资产id不为空，且等于当前页面资产，且当前选中的设备为改设备时，更新chart图表
        if(assetId && assetId === props.entityId && wsEntityId === currentDeviceValue.value){
          let ts = wsResp.data.ts;
          let key = wsResp.data.entry.key;
          let value = wsResp.data.entry.valueAsString;
          if(deviceHistoryDataTimeRef.value.length < maxItems){
            deviceHistoryDataTimeRef.value.push(moment(Number(ts)).format('YYYY-MM-DD HH:mm:ss'));
            deviceHistoryDataRef.value.forEach(record => {
              if(record.name as string === deviceAttrNameMapRef.value.get(key)){
                record.data.push(value+'');
              }
            })
          }
          deviceChartOptionsRef.value.xAxis.data = deviceHistoryDataTimeRef.value;
          deviceChartOptionsRef.value.series = deviceHistoryDataRef.value;
          deviceChart.getInstance()?.clear();
          deviceChart.getInstance()?.setOption(deviceChartOptionsRef.value);
        }
      }

      // 初始化界面
      async function init(){
        await nextTick();
        if(!deviceRtChartRef.value){
          return;
        }
        rtServiceRef.value = new AssetRealtimeService(props.entityId, deviceUpdateCallback);
        deviceListsRef.value = rtServiceRef.value?.getDeviceListOptions();
        attributeOptionsRef.value = rtServiceRef.value?.getFieldsByDeviceId(currentDeviceValue.value);
        // 设置曲线的配置项
        deviceChartOptionsRef.value = {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: rtServiceRef.value.getFieldNamesByDevice(currentDeviceValue.value),
            left: '15',
            textStyle: {
              color: '#989292',
            }
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
            data: deviceHistoryDataTimeRef.value
          },
          yAxis: {
            type: 'value',
            interval: 100,
            splitLine:{
              show: false
            }
          },
          series: deviceHistoryDataRef.value
        };
      }

      onMounted(init);
      return { deviceListsRef, deviceOnChange, attributeOptionsRef, attributeOnChange, currentTimeTag, currentDeviceValue, deviceRtChartRef, timeTagOnChange };
    }
  });
</script>
<style lang="less">
  .assetRealTimeLineContainer{
    width: 100%;
    height: 100%;
    .realtimeLineContentContainer{
      width: 100%;
      height: 100%;
      .assetRealTimeLineHeader{
        height: 28px;
        line-height: 28px;
        border-left: 3px solid #80ff00;
        .ant-select-selector{
          background-color: transparent;
          color: #989292;
          /*border: 1px solid #989292;*/
        }
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
  .assetLineBtnGroup{
    opacity: 0.7;
    float:right;
    padding-right: 10px;
    .ant-radio-button-wrapper{
      /*height: 20px;*/
      /*line-height: 20px;*/
      background-color: #3aa3da;
      border: none;
    }
  }
</style>
