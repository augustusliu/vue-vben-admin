<template>
  <ThreeModelHeader/>
  <canvas ref="tmContainerRef" class="threeModelContainer"></canvas>
  <div class="loadProgressContainer" v-show="progressLoadSuccess">
      <Progress :showInfo="true" :step ="10" :percent="modelProgressPercentRef" v-show="progressLoadSuccess"
                style="margin-top: 20%; width:50%; margin-left:20%"/>
  </div>
  <div class="leftFixedContentContainer">
    <Things3DModelCounter class="leftCard"/>
    <AssetAlarmHistogramMetric
      entityId="1527710747740426241"
      entityType="ASSET"
      class="leftCard"/>
    <LabelEntityPieMetric entityId="1527710747740426241" entityType="ASSET" class="leftCard1"/>
  </div>
  <div class="bottomContentContainer">
    <AssetRealtimeLine entityId="1533547983044182018" entityType="ASSET"/>
  </div>

  <div class="rightContentContainer">
    <DeviceTelemetryRtList style="height: 50%"/>
    <DeviceLatestRtAlarmList style="height: 50%; margin-top: 5%"/>
  </div>

</template>

<script lang="ts">
  import { PageEnum } from '/@/enums/pageEnum';
  import {Progress, Row, Col, Button} from 'ant-design-vue';
  import {defineComponent, nextTick, onBeforeUnmount, onMounted, Ref, ref} from 'vue';
  import {useUserStore} from "/@/store/modules/user";
  import {useGo} from "/@/hooks/web/usePage";
  import Things3DModelCounter
    from "/@/views/dashboard/threeModel/components/Things3DModelCounter.vue";
  import AssetAlarmHistogramMetric
    from "/@/views/things/asset/monitor/rt/AssetAlarmHistogramMetric.vue";
  import LabelEntityPieMetric from "/@/views/things/asset/monitor/rt/LabelEntityPieMetric.vue";
  import AssetRealtimeLine from "/@/views/things/asset/monitor/rt/AssetRealtimeLine.vue";
  import DeviceTelemetryRtList
    from "/@/views/dashboard/threeModel/components/DeviceTelemetryRtList.vue";
  import DeviceLatestRtAlarmList
    from "/@/views/dashboard/threeModel/components/DeviceLatestRtAlarmList.vue";
  import ThreeModelHeader from "/@/views/dashboard/threeModel/ThreeModelHeader.vue";
  import {ThingsDashboardScene} from "/@/badylon/ThingsDashboardScene";

  export default defineComponent({
    name: '3DModel',
    components: { ThreeModelHeader, Progress, Row, Col,Button, Things3DModelCounter, AssetAlarmHistogramMetric,
      LabelEntityPieMetric, AssetRealtimeLine, DeviceTelemetryRtList, DeviceLatestRtAlarmList},
    setup: function () {
      const tmContainerRef = ref() as Ref<HTMLCanvasElement>; //容器
      const modelProgressPercentRef = ref(0);
      const progressLoadSuccess = ref(true);
      const go = useGo();
      const userStore = useUserStore();
      const threeMainModelPath = userStore.getUserInfo.threeModelPath as string;
      const thingsDashboardSceneRef = ref() as Ref<ThingsDashboardScene>;



      // 进度条回告
      const progressCallback = (progress) => {
        modelProgressPercentRef.value = progress;
        if (modelProgressPercentRef.value === 100) {
          progressLoadSuccess.value = false;
        }
      }

      const clickCallback = (childModel:string, curAssetCode: string) => {
        if (childModel) {
          thingsDashboardSceneRef.value?.StopAnimate();
          go('/dt_child/' + childModel + "/" + curAssetCode);
        }
      }

      async function init() {
        if (!threeMainModelPath) {
          go(PageEnum.BASE_HOME);
        }
        await nextTick();
        if (!tmContainerRef.value) {
          return;
        }
        thingsDashboardSceneRef.value = new ThingsDashboardScene({
          canvas: tmContainerRef.value,
          cameraX: 30,
          cameraY: 60,
          cameraZ: 440,
          progressCallback: progressCallback,
          loadSuccessCallback: undefined,
          clickCallback: clickCallback,
        });
        window.addEventListener("resize", function () {
          if (thingsDashboardSceneRef.value.engine) {
            thingsDashboardSceneRef.value.engine.resize();
          }
        });
      }

      async function destroyModels() {
        if (thingsDashboardSceneRef.value) {
          thingsDashboardSceneRef.value.disposeScene();
        }
      }

      onMounted(init);
      onBeforeUnmount(destroyModels);
      return {tmContainerRef, modelProgressPercentRef, progressLoadSuccess}
    },
  });
</script>
<style lang="less">
  .threeModelContainer{
    margin: 0 0;
    padding: 0 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(rgb(0 0 0), rgb(1,23,92));
  }

  .loadProgressContainer{
    margin: 0 0;
    padding: 0 0;
    z-index: 10;
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top:0;
    background-image: linear-gradient(#547b95, #eecdaa);
  }
  .leftFixedContentContainer{
    margin: 0 0;
    padding: 0 0;
    position: fixed;
    left: 10px;
    top:60px;
    width: 22%;
    height: 90%;
    color: #989292;
  }
  .bottomContentContainer{
    margin: 0 0;
    padding: 0 0;
    position: fixed;
    left:23%;
    bottom: 6px;
    border-radius: 5px;
    height: 32%;
    width: 50%;
    background-color: #0a1f49;
    opacity: 0.9;
  }
  .rightContentContainer{
    margin: 0 0;
    padding: 0 0;
    position: fixed;
    right: 10px;
    top:60px;
    width: 26%;
    height: 90%;
    color: #989292;
    /*background-color: #0a1f49;*/
  }

  .leftCard{
    background-color: #0a1f49;
    width: 100%;
    height: 33%;
    opacity: 0.9;
    border-radius: 5px;
    /*margin-bottom: 15px;*/
  }
  .leftCard1{
    background-color: #0a1f49;
    width: 100%;
    height: 36%;
    opacity: 0.9;
    border-radius: 5px;
    /*margin-bottom: 15px;*/
  }
  .cardTitle{
    width: 100%;
    height: 30px;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    line-height: 30px;
    padding-left: 15px;
    vertical-align: center;
    border-left: 3px solid #80ff00;
  }
</style>
