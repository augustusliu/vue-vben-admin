<template>
  <div ref="tmContainerRef" style="margin: 0 0; padding: 0 0; width: 100%;height: 100%"></div>
  <div class="loadProgressContainer" v-show="progressLoadSuccess">
      <Progress :showInfo="true" :step ="10" :percent="modelProgressPercentRef" v-show="progressLoadSuccess"
                style="margin-top: 20%; width:50%; margin-left:20%"/>
  </div>
  <div class="mainInfoHeader">
    <Row>
      <Col span="8">
        <h3>电厂数字孪生平台</h3>
      </Col>
      <Col span="8">

      </Col>
      <Col span="6">
        <span> {{ currentTime }} </span>
      </Col>
      <Col span="2">
        <a :onclick="goHomePage" >工作台</a>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
  import { PageEnum } from '/@/enums/pageEnum';
  import {Progress, Row, Col} from 'ant-design-vue';
  import {defineComponent, nextTick, onBeforeUnmount, onMounted, Ref, ref} from 'vue';
  import {useUserStore} from "/@/store/modules/user";
  import {useGo} from "/@/hooks/web/usePage";
  import {ElectricPowerPlant} from "/@/views/dashboard/threeModel/ElectricPowerPlant";
  import {TimeUtil} from "/@/views/dashboard/threeModel/TimeUtil";
  export default defineComponent({
    name: '3DModel',
    components: { Progress, Row, Col },
    setup(){
      const tmContainerRef = ref() as Ref<HTMLElement>; //容器
      let electricPowerPlant = ref(null) as Ref<ElectricPowerPlant | null>;
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
        go(PageEnum.BASE_HOME);
      }


      // 进度条回告
      const progressCallback = (progress) => {
        modelProgressPercentRef.value = progress;
        if(progress === 100){
          progressLoadSuccess.value = false;
        }
      }

      const clickCallback = (modelObj) => {
        console.log(modelObj)
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
        electricPowerPlant.value = new ElectricPowerPlant(tmContainerRef, progressCallback, clickCallback);
        electricPowerPlant.value.start();
      }

      async function destroyComponent(){
        if(currentTimer){
          clearInterval(currentTimer);
        }
        if(electricPowerPlant.value){
          await electricPowerPlant.value.dispose();
        }
      }
      onMounted(init);
      onBeforeUnmount(destroyComponent);
      return {tmContainerRef, modelProgressPercentRef, progressLoadSuccess, currentTime, goHomePage}
    },
  });
</script>
<style lang="less">
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
  .mainInfoHeader{
    margin: 0 0;
    padding: 0 0;
    z-index: 9;width: 100%;
    height: 45px;
    left: 0;
    top:0;
    opacity: 0.4;
    position: absolute;
    background-color: #4559ee;
    line-height: 45px;
    h3{
      margin-left: 20px;
      color: #fff;
      font-size: 20px;
    }
    a{
      color: #fff;
      font-size: 14px;
      float: right;
      margin-right: 20px;
    }
    a:hover{
      cursor: pointer;
    }
    span{
      color: #fff;
      font-size: 14px;
    }
  }
</style>
