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
</template>

<script lang="ts">
  import {defineComponent, ref, onBeforeUnmount} from "vue";
  import {Row, Col, Button} from 'ant-design-vue';
  import {TimeUtil} from "/@/views/dashboard/threeModel/TimeUtil";
  import {useGo} from "/@/hooks/web/usePage";
  import {digitalTwinScene} from "/@/views/3d/ThingsScene";
  import {PageEnum} from "/@/enums/pageEnum";

  export default defineComponent({
    name: '3DModelHeader',
    components: { Row, Col, Button },
    setup(){
      const currentTime = ref(); // 当前时间
      const go = useGo();
      const timeUtil = new TimeUtil();
      const currentTimer = setInterval(() => {
        currentTime.value = timeUtil.getTime();
      }, 1000)

      function goHomePage(){
        if(digitalTwinScene){
          digitalTwinScene.stopAnimate();
        }
        go(PageEnum.BASE_HOME);
      }

      function destoryComponent(){
        if(currentTimer){
          clearInterval(currentTimer);
        }
      }
      onBeforeUnmount(destoryComponent);
      return { currentTime, goHomePage }
    }
  })

</script>


<style lang="less">
  .mainFixedHeader{
    margin: 0 0;
    padding-left: 15px;
    padding-right: 15px;
    z-index: 600;
    width: 100%;
    height: 45px;
    left: 0;
    top:0;
    position: fixed;
    background-color: rgb(1,15,65);
    opacity: 0.6;
    line-height: 50px;
    h3{
      color: #fff;
      font-size: 16px;
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
</style>

