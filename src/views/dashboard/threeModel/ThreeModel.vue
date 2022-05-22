<template>
  <div ref="tmContainerRef" class="threeModelContainer"></div>
  <div class="loadProgressContainer" v-show="progressLoadSuccess">
      <Progress :showInfo="true" :step ="10" :percent="modelProgressPercentRef" v-show="progressLoadSuccess"
                style="margin-top: 20%; width:50%; margin-left:20%"/>
  </div>
  <div class="mainInfoHeader">
    <Row>
      <Col span="8">
        <h3>电厂数字孪生平台</h3>
      </Col>
      <Col span="10">

      </Col>
      <Col span="4">
        <span> {{ currentTime }} </span>
      </Col>
      <Col span="2">
        <a :onclick="goHomePage" >工作台</a>
      </Col>
    </Row>
  </div>

  <div class="leftContentContainer">
    <div class="leftCard">
      <div class="cardTitle">接入统计</div>
    </div>

    <div class="leftCard">
      <div class="cardTitle">告警统计</div>
    </div>

    <div class="leftCard">
      <div class="cardTitle">在线活跃</div>
    </div>
  </div>
  <div class="rightContentContainer">
      <div class="leftCard">
        <div class="cardTitle">运行时长</div>
        <div class="">

        </div>
      </div>

      <div class="leftCard">
        <div class="cardTitle">消息总量</div>
        <div class="">

        </div>
      </div>

      <div class="leftCard">
        <div class="cardTitle">厂房数据</div>
        <div class="">

        </div>
      </div>
  </div>
  <div class="bottomContentContainer">
    <div class="cardTitle">实时遥测</div>
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

      function goHomePage(event?: Event){
        if(event){
          event.stopPropagation();
        }
        if(electricPowerPlant.value){
          electricPowerPlant.value.cancelAnimate();
        }
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
          electricPowerPlant.value.cancelAnimate();
          electricPowerPlant.value.dispose();
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
    canvas{
      background-image: linear-gradient(rgb(1,15,65), rgb(1,23,92));
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
  .mainInfoHeader{
    margin: 0 0;
    padding: 0 0;
    z-index: 9;width: 100%;
    height: 45px;
    left: 0;
    top:0;
    position: absolute;
    background-color: rgb(1,23,92);
    opacity: 0.3;
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
  .leftContentContainer{
    margin: 0 0;
    padding: 0 0;
    z-index: 9;
    position: absolute;
    left: 10px;
    top:65px;
    width: 25%;
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

  .bottomContentContainer{
    margin: 0 0;
    padding: 0 0;
    z-index: 9;
    position: absolute;
    left:26%;
    bottom: 10px;
    background-color: rgb(1,23,92);
    opacity: 0.3;
    border-radius: 5px;
    height: 228px;
    width: 48%;
  }

  .leftCard{
    width: 100%;
    height: 200px;
    background-color: rgb(1,23,92);
    opacity: 0.3;
    border-radius: 5px;
    margin-bottom: 30px;
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
