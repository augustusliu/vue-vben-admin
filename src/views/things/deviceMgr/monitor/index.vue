<template>
  <PageWrapper class="h-full w-full">

    <div class="lg:flex" style="margin-top: 10px">
      <div class="lg:w-10/10 w-full !mr-4 enter-y" style="min-height: 330px">
        <DeviceAnalysisTelemetryLine :deviceId="deviceId" class="enter-y" style="min-height: 330px"/>
      </div>
    </div>

    <div class="lg:flex" style="margin-top: 10px">
      <div class="lg:w-3/10 w-full !mr-4 enter-y" style="min-height: 310px">
        <AssetAlarmHistogramMetric :entityId="deviceId" :entityType="entityType" class="enter-y" style="min-height: 310px"/>
      </div>
      <div class="lg:w-7/10 w-full !mr-4 enter-y" style="min-height: 310px">
        <DeviceCommandHistoryList :entityId="deviceId" :entityType="entityType" class="enter-y" style="min-height: 310px"/>
      </div>
    </div>
  </PageWrapper>
</template>

<script lang="ts">
  import {defineComponent,ref} from 'vue';
  import { Row, Col } from 'ant-design-vue';
  import DeviceAnalysisTelemetryLine from "./DeviceAnalysisTelemetryLine.vue";
  import DeviceAnalysisAlarmLineGroup from "./DeviceAnalysisAlarmLineGroup.vue";
  import {useRoute} from "vue-router";
  import DeviceCommandHistoryList
    from "/@/views/things/deviceMgr/monitor/DeviceCommandHistoryList.vue";
  import AssetAlarmHistogramMetric
    from "/@/views/things/asset/monitor/rt/AssetAlarmHistogramMetric.vue";
  import {PageWrapper} from "/@/components/Page";

  export default defineComponent({
    name: 'DeviceRealtime',
    components: {DeviceAnalysisTelemetryLine, DeviceAnalysisAlarmLineGroup,
      DeviceCommandHistoryList, Row, Col ,AssetAlarmHistogramMetric, PageWrapper},
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
  .vben-page-wrapper, .vben-page-wrapper-content{
    padding: 0px 0px!important;
    margin: 0px 0px!important;
  }
  .analysisContainer{
    width: 100%;
    height: 100%;
  }

</style>
