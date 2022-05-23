<template>
  <div class="h-full w-full" style="margin-top: 15px">
    <div style="height: 48%; width: 100%;">
      <DeviceAnalysisTelemetryLine :deviceId="deviceId" style="width: 100%; height: 100%"/>
    </div>

    <div style="height:46%; margin-top: 15px; width: 33%; float: left">
      <DeviceAnalysisAlarmLineGroup :deviceId="deviceId" style="width: 100%; height: 100%; float: left"/>
    </div>
    <div style="height:46%; margin-top: 15px; width: 66%; float: left">
      <DeviceCommandHistoryList :entityId="deviceId" :entityType="entityType"/>
    </div>
  </div>
</template>

<script lang="ts">
  import {defineComponent,ref} from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import DeviceAnalysisTelemetryLine from "./DeviceAnalysisTelemetryLine.vue";
  import DeviceAnalysisAlarmLineGroup from "./DeviceAnalysisAlarmLineGroup.vue";
  import {useRoute} from "vue-router";
  import DeviceCommandHistoryList
    from "/@/views/things/deviceMgr/monitor/DeviceCommandHistoryList.vue";

  export default defineComponent({
    name: 'DeviceRealtime',
    components: {DeviceAnalysisTelemetryLine, DeviceAnalysisAlarmLineGroup, DeviceCommandHistoryList, Row, Col },
    setup(){
      const route = useRoute();
      // 此处可以得到用户ID
      const deviceId = ref(route.params?.id).value as string;
      const entityType = ref('DEVICE')

      return {deviceId, entityType}
    }
  });
</script>
<style lang="less">
  .analysisContainer{
    width: 100%;
    height: 100%;
  }

</style>
