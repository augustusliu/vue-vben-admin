<template>
  <div class="h-full w-full counterContainer">
    <Row class="counterHeader">
      <Col>
        <span>接入统计</span>
      </Col>
    </Row>
    <Row gutter="[1,1]" class="w-full counterGrid">
      <Col span="12" class="right-border bottom-border">
        <div class="circle-grid">
          <div class="counterNumber">{{assetCount}}</div>
          <div class="counterNumberTitle">资产总数</div>
        </div>
      </Col>
      <Col span="12" class="bottom-border">
        <div class="circle-grid">
          <div class="counterNumber">{{waitingAlarmCounter}}</div>
          <div class="counterNumberTitle">报警待处理</div>
        </div>
      </Col>
      <Col span="12" class="right-border">
        <div class="circle-grid">
          <div class="counterNumber">{{deviceCount}}</div>
          <div class="counterNumberTitle">设备总量</div>
        </div>
      </Col>
      <Col span="12">
        <div class="circle-grid">
          <div class="counterNumber">{{onlineDeviceCount}}</div>
          <div class="counterNumberTitle">设备在线</div>
        </div>
      </Col>
    </Row>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref} from "vue";
  import {Row, Col} from "ant-design-vue";
  export default defineComponent({
    name: 'Things3DModelCounterComponent',
    components: {Row, Col },
    setup(){
      const assetCount = ref(32);
      const deviceCount = ref(143);
      const onlineDeviceCount = ref(45);
      const waitingAlarmCounter = ref(4);
      return { assetCount, deviceCount, waitingAlarmCounter, onlineDeviceCount };
    }
  });
</script>

<style lang="less">
  .vben-page-wrapper .vben-page-wrapper-content{
    padding:0 0;
    margin: 0 0;
    height: 100%;
    width: 100%;
  }
  .ant-row{
    width: 100%;
    height: 100%;
  }
  .counterContainer{
    width: 100%;
    height: 100%;
  }
  .counterHeader{
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
  }
  .counterGrid{
    width: 100%;
    min-height: 140px;
    height: 90% !important;
    margin-top: -8px;
  }

  .right-border{
    border-right: 1px solid #1e345d;
  }
  .bottom-border{
    border-bottom: 1px solid #1e345d;
  }
  .counterNumber{
    height: 32px;
    text-align: center;
    line-height: 32px;
    font-size: 16px;
    color: #989292;
    width: 100%;
  }
  .counterNumberTitle{
    max-height: 14px;
    text-align: center;
    line-height: 14px;
    font-size: 10px;
    color: #989292;
    width: 100%;
  }
  .circle-grid{
    position: absolute;
    top: 50px;
    left: 40px;
    height: 80px;
    width: 80px;
    margin: -40px 0 0 0;
    border-radius: 50%;
    padding-top: 20px;
    background: -webkit-radial-gradient( circle closest-side, #071b40 96%, #fff 50%);
    opacity: 0.7;
  }
</style>
