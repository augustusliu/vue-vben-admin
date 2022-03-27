<template>
  <Descriptions style="height: 150px">
    <Row>
      <Col>
        <Row :span="24">
          <Col :span="20">
            <span class="things-card-title"> {{dataRecord.name}}</span>
          </Col>
          <Col :span="4">
            <Tag color="success" v-if="dataRecord.online">在线</Tag>
            <Tag color="default" v-else >离线</Tag>
          </Col>
        </Row>
        <Row :span="24" style="margin-top: 10px">
          <Col :span="6">
            <span class="things-field-name">设备编号</span>
          </Col>
          <Col :span="18">
            <span class="things-desc">{{dataRecord.code}}</span>
          </Col>
        </Row>
        <Row :span="24" style="margin-top: 10px">
          <Col :span="6">
            <span class="things-field-name">传输协议</span>
          </Col>
          <Col :span="10">
            <span class="things-desc">{{dataRecord.transportType}}</span>
          </Col>
          <Col :span="8" v-if="dataRecord.isGateway">
            <Tag color="cyan" >网关设备</Tag>
          </Col>
        </Row>
        <Row :span="24" style="margin-top: 10px">
          <Col :span="6">
            <span class="things-field-name">设备描述：</span>
          </Col>
          <Col :span="18">
            <span class="things-desc"> {{deviceDesc}}</span>
          </Col>
        </Row>

      </Col>
    </Row>
  </Descriptions>
</template>

<script type="ts">
  import { Descriptions, DescriptionsItem, Row, Col, Tag, Badge } from 'ant-design-vue';
  import moment from "moment";
  import { defineComponent} from "vue";

  export default defineComponent({
    name: 'DeviceCardContentSlot',
    props: {
      dataInfo: {
        type: Object,
      }
    },
    components: { Descriptions, DescriptionsItem, Row, Col, Tag, Badge},
    setup(props){
      const dataRecord = props.dataInfo;
      let deviceDesc = dataRecord.description;
      if(deviceDesc && deviceDesc.length > 30){
        deviceDesc = deviceDesc.substr(0, 30) + '...';
      }
      let formatCreated = moment(Number(dataRecord.createdTime)).format('YYYY-MM-DD HH:mm:ss');
      return { dataRecord, formatCreated, deviceDesc};
    }
  });
</script>

<style lang="less">
  .ant-card-body{
    padding: 6px 8px;
  }
  .things-card-title{
    font-size: 14px;
    color: #716565;
    font-weight: bold;
  }
  .things-card-status{
    float: right;
    color: #2ba46d;
  }
  .things-field-name{
    font-size: 13px;
    color: #716565;
  }
  .things-desc{
    font-size: 12px;
    font-weight: normal;
    color: #606266;
  }
</style>
