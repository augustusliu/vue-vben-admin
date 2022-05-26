<template>
  <PageWrapper class="h-full w-full counterContainer">
    <Row class="counterHeader">
      <Col>
        <span>接入统计</span>
      </Col>
    </Row>
    <Row gutter="[1,1]" class="w-full h-full counterGrid">
      <Col span="12" class="right-border right-bottom">
        <div class="counterNumber">{{assetCount}}</div>
        <div class="counterNumberTitle">资产总数</div>
      </Col>
      <Col span="12" class="right-bottom">
        <div class="counterNumber">{{assetCount}}</div>
        <div class="counterNumberTitle">报警待处理</div>
      </Col>
      <Col span="12" class="right-border">
        <div class="counterNumber">{{assetCount}}</div>
        <div class="counterNumberTitle">设备总量</div>
      </Col>
      <Col span="12">
        <div class="counterNumber">{{assetCount}}</div>
        <div class="counterNumberTitle">设备在线</div>
      </Col>
    </Row>
  </PageWrapper>
</template>

<script lang="ts">
  import {defineComponent, ref} from "vue";
  import {PageWrapper} from "/@/components/Page";
  import {Row, Col} from "ant-design-vue";
  export default defineComponent({
    name: 'Things3DModelCounterComponent',
    components: { PageWrapper, Row, Col },
    setup(){
      const assetCount = ref(0);
      const deviceCount = ref(0);
      const waitingAlarmCounter = ref(0);

      return { assetCount, deviceCount, waitingAlarmCounter };
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
    color: #f3f3f3;
    width: 100%;
    max-height: 28px;
    height: 10%;
    font-size: 14px;
    font-weight: bold;
    line-height: 28px;
    vertical-align: center;
    padding-left: 15px;
    border-left: 3px solid #80ff00;
  }
  .counterGrid{
    width: 100%;
    height: 90%;
  }
  .right-border{
    border-right: 1px solid #7c8087;
  }
  .right-bottom{
    border-bottom: 1px solid #7c8087;
  }
  .counterNumber{
    max-height: 44px;
    text-align: center;
    line-height: 44px;
    font-size: 28px;
    color: #fff;
    width: 100%;
  }
  .counterNumberTitle{
    max-height: 20px;
    text-align: center;
    line-height: 20px;
    font-size: 10px;
    color: #fff;
    width: 100%;
  }
</style>
