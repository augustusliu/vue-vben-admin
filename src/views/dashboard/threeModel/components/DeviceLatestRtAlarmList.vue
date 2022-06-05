<template>
  <div class="h-full w-full deviceAlarmRtContainer">
    <Row class="rtListHeader">
      <Col>
        <span>实时报警</span>
      </Col>
    </Row>
    <Row class="telemetryDataContainer">
      <Col span="24">
<!--        <div class="listDataTitle">-->
<!--          <div>设备</div>-->
<!--          <div style="width: 50%">内容</div>-->
<!--          <div>时间</div>-->
<!--        </div>-->
        <Row>
          <Col span="24">
            <div class="listRtDataItem" v-for="item in deviceTelemetryListRef">
              <div style="width: 25%">
                {{ item.deviceName }}
              </div>
              <div style="width: 50%">
                {{ item.content }}
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
  import {getTenantLatestAlarms} from "/@/api/things/alarm/alarmApi";
  import {thingsWebSocket} from "/@/layouts/default/header/ws/ThingsWebSocket";


  export default defineComponent({
    name: 'DeviceRtListAlarmComponent',
    components: {Row, Col, List, ListItem },
    setup(){
      // 遥测的历史数据，非单个设备，而是全量设备
      const deviceTelemetryListRef = ref<any>([]);

      async function loadInitData(){
        const latestAlarms = await getTenantLatestAlarms();
        if(!latestAlarms){
          return;
        }
        const formateData: any[] = [];
        latestAlarms.forEach(item => {
          formateData.push({
            deviceName: nameSubstr(item.entityName),
            content: nameSubstr(item.alarmContent, 10),
            ts: moment(Number(item.createdTime)).format('HH:mm:ss')
          });
        })
        deviceTelemetryListRef.value = formateData;
      }

      function nameSubstr(strSub: string, length?: number){
        let maxLength = length? length: 5;
        if(strSub.length > maxLength){
          return strSub.substring(0, maxLength) + '...';
        }
        return strSub;
      }

      function alarmCallback(responseData){
        // unshift pop
        if(responseData){
          const formateAlarmItem = {
            deviceName: nameSubstr(responseData.entityName),
            content: nameSubstr(responseData.data.alarmContent, 10),
            ts: moment(Number(responseData.data.createdTime)).format('HH:mm:ss')
          }

          deviceTelemetryListRef.value.pop();
          deviceTelemetryListRef.value.unshift(formateAlarmItem);
        }
      }

      if(!thingsWebSocket.isConnected()){
        thingsWebSocket.init();
      }
      // 注册报警回调事件
      thingsWebSocket.updateCallback({
        deviceAlarmCallbackFunc: alarmCallback,
      })
      onMounted(loadInitData);
      return { deviceTelemetryListRef }
    }
  });
</script>

<style lang="less">
  .deviceAlarmRtContainer{
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
      padding-top:8px;
      padding-bottom: 8px;
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
