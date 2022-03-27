<template>
  <Descriptions style="height: 140px">
    <Row>
      <Col>
        <Row :span="24">
          <Col :span="20">
            <span class="things-card-title"> {{dataRecord.name}}</span>
          </Col>
          <Col :span="4">
            <Tag color="gold" v-if="dataRecord.enabled">启用</Tag>
            <Tag color="volcano" v-else >禁用</Tag>
          </Col>
        </Row>
        <Row :span="24" style="margin-top: 15px">
          <Col :span="6">
            <span class="things-field-name">创建时间：</span>
          </Col>
          <Col :span="18">
            <span class="things-desc"> {{ formatCreated }} </span>
          </Col>
        </Row>
        <Row :span="24" style="margin-top: 15px">
          <Col :span="6">
            <span class="things-field-name">模型描述：</span>
          </Col>
          <Col :span="18">
            <span class="things-desc"> {{templateDesc}}</span>
          </Col>
        </Row>

      </Col>
    </Row>
  </Descriptions>
</template>

<script type="ts">
  import { Descriptions, DescriptionsItem, Row, Col, Tag } from 'ant-design-vue';
  import moment from "moment";
  import { defineComponent} from "vue";

  export default defineComponent({
    name: 'TemplateCardContentSlot',
    props: {
      dataInfo: {
        type: Object,
      }
    },
    components: { Descriptions, DescriptionsItem, Row, Col, Tag},
    setup(props){
      const dataRecord = props.dataInfo;
      let templateDesc = dataRecord.description;
      if(templateDesc && templateDesc.length > 30){
        templateDesc = templateDesc.substr(0, 30) + '...';
      }
      let formatCreated = moment(Number(dataRecord.createdTime)).format('YYYY-MM-DD HH:mm:ss');
      return { dataRecord, formatCreated, templateDesc};
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
