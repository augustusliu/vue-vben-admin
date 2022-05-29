<template>
  <ThreeModelHeader/>

  <div ref="tmContainerRef" class="threeModelContainer"></div>
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
    <AssetRealtimeLine entityId="1527710747740426241" entityType="ASSET"/>
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
  import {digitalTwinScene} from "/@/views/3d/ThingsScene";
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
  import {listAssetAllThreeModelsAssets} from "/@/api/things/asset/assetApi";

  const electricModels = [
    'models/electric/plant.glb',
    'models/electric/byq.glb',
    'models/electric/house.glb',
    'models/electric/smoker.glb',
    'models/electric/momei.glb',
    'models/electric/gl.glb',
    'models/electric/coolpower.glb',
    'models/electric/gl.glb',
    'models/electric/house.glb',
    'models/electric/meichang.glb',
    'models/electric/momei.glb',
    'models/electric/smoker.glb',
  ]

  export default defineComponent({
    name: '3DModel',
    components: { ThreeModelHeader, Progress, Row, Col,Button, Things3DModelCounter, AssetAlarmHistogramMetric,
      LabelEntityPieMetric, AssetRealtimeLine, DeviceTelemetryRtList, DeviceLatestRtAlarmList},
    setup(){
      const tmContainerRef = ref() as Ref<HTMLElement>; //容器
      const modelProgressPercentRef = ref(0);
      const progressLoadSuccess = ref(true);
      const go = useGo();
      const userStore = useUserStore();
      const threeMainModelPath = userStore.getUserInfo.threeModelPath as string;

      // 缓存当前模型资产的数据
      let assetsOfModelMap = new Map();

      if(!threeMainModelPath){
        if(digitalTwinScene){
          digitalTwinScene.stopAnimate();
        }
        go(PageEnum.BASE_HOME);
      }

      // 进度条回告
      const progressCallback = (progress) => {
        modelProgressPercentRef.value = progress;
        if(modelProgressPercentRef.value === 100){
          progressLoadSuccess.value = false;
        }
      }

      const clickCallback = (childModel) => {
        console.log(childModel);
        if(childModel){
          digitalTwinScene.stopAnimate();
          go('/dt_child/' + childModel.modelPath);
        }
      }

      // 加载3d模型对应的资产
      async function loadAssetOfModels(){
        const assets = await listAssetAllThreeModelsAssets();
        if(!assets || assets.length <= 0){
          return;
        }

        assetsOfModelMap = new Map();
        assets.forEach(asset => {
          assetsOfModelMap.set(asset.code, asset);
        });
      }


      async function init() {
        await nextTick();
        if (!tmContainerRef.value) {
          return;
        }
        await loadAssetOfModels();
        // 优先获取对应的3d模型对一个的资产
        digitalTwinScene.init(tmContainerRef.value, {
          cameraX: -120,
          cameraY: 450,
          cameraZ: 150,
          cameraFov: 65,
          cameraNear: 0.1,
          cameraFar: 1000,
          canControls: true,
          sceneBackTransport:true,
          openAutoRotate: true,
          assetsOfModelMap: assetsOfModelMap,
        }, progressCallback, clickCallback)

        digitalTwinScene.loadGltfBatch(electricModels);
      }

      async function destroyModels(){
        if(digitalTwinScene){
          digitalTwinScene.disposeSceneObjs();
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
    canvas{
      background-image: linear-gradient(rgb(0 0 0), rgb(1,23,92));
    }
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
