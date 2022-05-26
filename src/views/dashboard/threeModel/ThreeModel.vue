<template>
  <div class="mainFixedHeader">
    <Row>
      <Col span="8">
        <h3>电厂数字孪生平台</h3>
      </Col>
      <Col span="8">

      </Col>
      <Col span="5" >
        <span> {{ currentTime }} </span>
      </Col>
      <Col span="3">
        <a-button type="dashed" size="small" class="goHomeBtn" @click="goHomePage"> 工作台 </a-button>
      </Col>
    </Row>
  </div>

  <div ref="tmContainerRef" class="threeModelContainer"></div>
  <div class="loadProgressContainer" v-show="progressLoadSuccess">
      <Progress :showInfo="true" :step ="10" :percent="modelProgressPercentRef" v-show="progressLoadSuccess"
                style="margin-top: 20%; width:50%; margin-left:20%"/>
  </div>
  <div class="leftFixedContentContainer">
    <Things3DModelCounter class="leftCard"/>
    <AssetAlarmHistogramMetric entityId="1527710747740426241" entityType="ASSET" class="leftCard"/>
    <LabelEntityPieMetric entityId="1527710747740426241" entityType="ASSET" class="leftCard"/>
  </div>
  <div class="bottomContentContainer">
    <AssetRealtimeLine entityId="1527710747740426241" entityType="ASSET"/>
  </div>

</template>

<script lang="ts">
  import { PageEnum } from '/@/enums/pageEnum';
  import {Progress, Row, Col, Button} from 'ant-design-vue';
  import {defineComponent, nextTick, onBeforeUnmount, onMounted, Ref, ref, watchEffect} from 'vue';
  import {useUserStore} from "/@/store/modules/user";
  import {useGo} from "/@/hooks/web/usePage";
  import {TimeUtil} from "/@/views/dashboard/threeModel/TimeUtil";
  import {digitalTwinScene} from "/@/views/3d/ThingsScene";
  import Things3DModelCounter
    from "/@/views/dashboard/threeModel/components/Things3DModelCounter.vue";
  import AssetAlarmHistogramMetric
    from "/@/views/things/asset/monitor/rt/AssetAlarmHistogramMetric.vue";
  import LabelEntityPieMetric from "/@/views/things/asset/monitor/rt/LabelEntityPieMetric.vue";
  import AssetRealtimeLine from "/@/views/things/asset/monitor/rt/AssetRealtimeLine.vue";

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
    components: { Progress, Row, Col,Button, Things3DModelCounter, AssetAlarmHistogramMetric, LabelEntityPieMetric, AssetRealtimeLine},
    setup(){
      const tmContainerRef = ref() as Ref<HTMLElement>; //容器
      const modelProgressPercentRef = ref(0);
      const progressLoadSuccess = ref(true);
      const currentTime = ref(); // 当前时间
      const go = useGo();
      const userStore = useUserStore();
      const threeMainModelPath = userStore.getUserInfo.threeModelPath as string;
      if(!threeMainModelPath){
        goHomePage();
      }

      function goHomePage(){
        if(digitalTwinScene){
          digitalTwinScene.stopAnimate();
        }
        go(PageEnum.BASE_HOME);
      }

      // // 实时监听，以方便停止动画
      // watchEffect(() => {
      //   if (digitalTwinScene.animateRunningEnd && digitalTwinScene.animateFrameId) {
      //     cancelAnimationFrame(digitalTwinScene.animateFrameId);
      //   }
      // })

      // 进度条回告
      const progressCallback = (progress) => {
        modelProgressPercentRef.value = progress;
        if(modelProgressPercentRef.value === 100){
          progressLoadSuccess.value = false;
        }
      }

      const clickCallback = (modelObj) => {
        console.log(modelObj)
        digitalTwinScene.stopAnimate();
      }

      const timeUtil = new TimeUtil();
      const currentTimer = setInterval(() => {
        currentTime.value = timeUtil.getTime();
      }, 1000)

      async function init() {
        await nextTick();
        if (!tmContainerRef.value) {
          return;
        }
        // 取消先前的场景
        if(digitalTwinScene){
          digitalTwinScene.disposeSceneObjs();
        }

        digitalTwinScene.init(tmContainerRef.value, {
          cameraX: -20,
          cameraY: 280,
          cameraZ: 45,
          cameraFov: 65,
          cameraNear: 0.1,
          cameraFar: 1000,
          canControls: true,
          sceneBackTransport:true,
        }, progressCallback, clickCallback)

        electricModels.forEach(item => {
          digitalTwinScene.loadGLTFModel(item);
        });

      }

      async function destroyComponent(){
        if(currentTimer){
          clearInterval(currentTimer);
        }

        if(digitalTwinScene){
          digitalTwinScene.disposeSceneObjs();
        }
      }
      onMounted(init);
      onBeforeUnmount(destroyComponent);
      return {tmContainerRef, modelProgressPercentRef, progressLoadSuccess, currentTime, goHomePage}
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
  .mainFixedHeader{
    margin: 0 0;
    padding-left: 15px;
    padding-right: 15px;
    z-index: 600;
    width: 100%;
    height: 50px;
    left: 0;
    top:0;
    position: fixed;
    background-color: rgb(1,15,65);
    opacity: 0.6;
    line-height: 50px;
    h3{
      color: #fff;
      font-size: 20px;
    }
    .goHomeBtn{
      color: #fff;
      font-size: 14px;
      background-color: rgb(1,23,92);
      border: 1px dashed #fff;
      cursor: pointer;
    }
    span{
      color: #fff;
      font-size: 14px;
    }
  }
  .leftFixedContentContainer{
    margin: 0 0;
    padding: 0 0;
    position: fixed;
    left: 10px;
    top:60px;
    width: 25%;
    height: 90%;
    color: #989292;
  }
  .bottomContentContainer{
    margin: 0 0;
    padding: 0 0;
    position: fixed;
    left:26%;
    bottom: 2px;
    border-radius: 5px;
    height: 32%;
    width: 73%;
    background-color: #0a1f49;
    opacity: 0.9;
  }
  .rightContentContainer{
    margin: 0 0;
    padding: 0 0;
    z-index: 9;
    position: absolute;
    right: 10px;
    top:65px;
    width: 25%;
  }

  .leftCard{
    background-color: #0a1f49;
    width: 100%;
    height: 33%;
    opacity: 0.9;
    border-radius: 5px;
    margin-bottom: 15px;
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
