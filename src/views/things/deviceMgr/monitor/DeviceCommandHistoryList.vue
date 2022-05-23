<template>
  <div class="h-full w-full alarmAnalysisListContainer">
    <div class="h-full w-full" style="background-color: #fff;height: 100%; min-height: 300px">
      <Row>
        <Col span="24" class="h-full">
          <BasicTable @register="registerTable">
            <template #toolbar >
              <a-button type="primary" @click="handleCreate" v-if="createBtnShow"> 远程控制 </a-button>
            </template>
          </BasicTable>
          <IssueCommandDrawer @register="registerDrawer" @success="handleSuccess" :entityId="entityId" :entityType="entityType" />
        </Col>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { Row, Col,} from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import {EntityTypeEnum} from "/@/enums/entityEnum";
  import {useDrawer} from "/@/components/Drawer";
  import {
    issueAssetCommandColumn,
    issueDeviceCommandColumn,
  } from "/@/views/things/common/entityTabs/issue.data";
  import IssueCommandDrawer from "/@/views/things/common/entityTabs/IssueCommandDrawer.vue";
  import {listIssuePagerApi} from "/@/api/things/device/deviceApi";
  import {IssueOrAttrType} from "/@/enums/IssueOrAttrTypeEnum";

  export default defineComponent({
    // 组件名称
    name: 'DeviceCommandHistoryList',
    // 当前依赖的组件
    components: { BasicTable, Row, Col, IssueCommandDrawer },
    props:["entityId", "entityType"],
    setup(props) {
      const entityId = props.entityId;
      const entityType = props.entityType;
      const [registerDrawer, {openDrawer}] = useDrawer();
      const createBtnShow = (entityType === EntityTypeEnum.DEVICE);
      const tableColumns = entityType === EntityTypeEnum.ASSET ? issueAssetCommandColumn : issueDeviceCommandColumn;
      // 用户控制是否可以添加属性，只有设备才可以添加属性，资产的属性是采用的设备的属性
      const [registerTable, {reload}] = useTable({
        title: '控制列表',
        api: listIssuePagerApi,
        columns: tableColumns,
        showTableSetting: false,
        tableSetting: {
          redo: true,
          size: false,
          setting: false,
          fullScreen: false,
        },
        pagination: false,
        bordered: true,
        showIndexColumn: true,
        canResize: true, // 调整表格自动高度
        beforeFetch: (record) => {
          record.entityId = entityId;
          record.entityType = entityType;
          record.issueType = IssueOrAttrType.COMMAND;
          return record;
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleSuccess() {
        reload();
      }

      return {
        entityId,
        entityType,
        registerDrawer,
        registerTable,
        handleCreate,
        handleSuccess,
        createBtnShow
      };
    }
  })

</script>
<style lang="less">
  .alarmAnalysisListContainer{
    padding-left: 10px;
    padding-right: 10px;
  }
  .alarmListTableContainer{
    width: 100%;
    height: 82%;
  }
  .ant-row{
    width: 100%;
    height: 100%;
  }

</style>
