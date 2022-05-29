<template>
  <div class="h-full w-full telemetryContainer">
    <Row class="rtListHeader">
      <Col>
        <span>实时数据</span>
      </Col>
    </Row>
    <Row class="telemetryDataContainer">
      <Col span="24">
<!--        <div class="listDataTitle">-->
<!--          <div>设备</div>-->
<!--          <div>指标</div>-->
<!--          <div>值</div>-->
<!--          <div>时间</div>-->
<!--        </div>-->
        <Row>
          <Col span="24">
            <div class="listRtDataItem" v-for="item in deviceTelemetryListRef">
              <div style="width: 25%">
                {{ item.deviceName }}
              </div>
              <div style="width: 25%">
                {{ item.attrName }}
              </div>
              <div style="width: 25%">
                {{ item.val }}
              </div>
              <div style="width: 25%">
                {{ item.ts }}
              </div>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref, onMounted} from "vue";
  import {Row, Col, List, ListItem} from "ant-design-vue";
  import moment from "moment";
  import { getLatestTelemetryInTenantApi } from "/@/api/things/attribute/attrApi";
  import {thingsWebSocket} from "/@/layouts/default/header/ws/ThingsWebSocket";

  export default defineComponent({
    name: 'DeviceTelemetryRtListComponent',
    components: {Row, Col, List, ListItem },
    setup(){
      // 遥测的历史数据，非单个设备，而是全量设备
      const deviceTelemetryListRef = ref<any>([]);

      async function loadInitData(){
        const latestTelemetry = await getLatestTelemetryInTenantApi();
        if(!latestTelemetry){
          return;
        }
        const formateData: any[] = [];
        latestTelemetry.forEach(item => {
          formateData.push({
            deviceName: nameSubstr(item.deviceName),
            attrName: nameSubstr(item.name),
            val: item.lastValue,
            ts: moment(Number(item.lastValueTs)).format('HH:mm:ss')
          });
        })
        deviceTelemetryListRef.value = formateData;
      }

      function nameSubstr(strSub: string){
        if(strSub.length > 5){
          return strSub.substring(0, 5) + '...';
        }
        return strSub;
      }

      const command3DWsCallback = (responseData) => {
        const formateCommand = {
          deviceName: nameSubstr(responseData.entityName),
          attrName: nameSubstr(responseData.data.entry.key),
          val: responseData.data.entry.valueAsString,
          ts: moment(Number(responseData.data.ts)).format('HH:mm:ss')
        }
        deviceTelemetryListRef.value.pop();
        deviceTelemetryListRef.value.unshift(formateCommand);
      }

      const attr3dWsCallback = (responseData) => {
        const formateAttribute = {
          deviceName: nameSubstr(responseData.entityName),
          attrName: nameSubstr(responseData.data.entry.key),
          val: responseData.data.entry.valueAsString,
          ts: moment(Number(responseData.data.ts)).format('HH:mm:ss')
        }
        deviceTelemetryListRef.value.pop();
        deviceTelemetryListRef.value.unshift(formateAttribute);
      }


      if(!thingsWebSocket.isConnected()){
        thingsWebSocket.init();
      }

      // 注册报警回调事件
      thingsWebSocket.updateCallback({
        deviceAttributeCallbackFunc: attr3dWsCallback,
        deviceCommandCallbackFunc: command3DWsCallback
      });

      onMounted(loadInitData);
      return { deviceTelemetryListRef }
    }
  });
</script>

<style lang="less">
  .telemetryContainer{
    width: 100%;
    height: 100%;
    .rtListHeader{
      color: #989292;
      width: 100%;
      height: 10%;
      max-height: 28px;
      line-height: 28px;
      font-size: 14px;
      font-weight: bold;
      vertical-align: center;
      padding-left: 15px;
      border-left: 3px solid #80ff00;
      background-image: linear-gradient(to right, #0a1f49, #547b95);
    }
    .telemetryDataContainer{
      width: 100%;
      height: 90%;
      overflow-y: scroll;
      .listDataTitle{
        width: 100%;
        height: 40px;
        line-height: 40px;
        background-color: #0a1f49;
        font-size: 14px;
        font-weight: bolder;
        div{
          float: left;
          text-align: center;
          width: 25%;
        }
      }
      .listRtDataItem{
        width: 100%;
        height: 40px;
        line-height: 40px;
        background-color: #0a1f49;
        border-top: 1px dashed #7c8087;
        font-size: 10px;
        div{
          float: left;
          text-align: center;
          width: 25%;
        }
      }
    }
  }

</style>
