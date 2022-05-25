<template>
  <div class="h-full w-full alarmAnalysisListContainer">
    <div class="h-full w-full" style="background-color: #fff;height: 100%; min-height: 300px">
      <Row>
        <Col span="24" class="h-full">
          <BasicTable @register="registerIssueCommandTable">
            <template #toolbar >
              <a-button type="primary" @click="handleIssueCommandCreate"> 远程控制 </a-button>
            </template>
          </BasicTable>
          <IssueCommandDrawer @register="registerIssueCommandDrawer" @success="handleIssueCommandSuccess" :entityId="entityId" :entityType="entityType" />
        </Col>
      </Row>
    </div>
  </div>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
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
      const entityId = props.entityId as number;
      const entityType = props.entityType as string;
      const [registerIssueCommandDrawer, issueCommandDrawerMethod] = useDrawer();
      const tableColumns = entityType === EntityTypeEnum.ASSET ? issueAssetCommandColumn : issueDeviceCommandColumn;
      // 用户控制是否可以添加属性，只有设备才可以添加属性，资产的属性是采用的设备的属性
      const [registerIssueCommandTable, issueCommandMethods] = useTable({
        title: '遥控日志',
        api: listIssuePagerApi,
        columns: tableColumns,
        striped: false,
        size: 'small',
        showTableSetting: true,
        tableSetting: {
          redo: false,
          size: false,
          setting: false,
          fullScreen: false,
        },
        pagination: false,
        bordered: false,
        showIndexColumn: false,
        canResize: true, // 调整表格自动高度
        beforeFetch: (record) => {
          record.entityId = entityId;
          record.entityType = entityType;
          record.issueType = IssueOrAttrType.COMMAND;
          return record;
        },
      });

      function handleIssueCommandCreate() {
        issueCommandDrawerMethod.openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleIssueCommandSuccess() {
        issueCommandMethods.reload();
      }

      return {
        entityId,
        entityType,
        registerIssueCommandDrawer,
        registerIssueCommandTable,
        handleIssueCommandCreate,
        handleIssueCommandSuccess,
      };
    }
  })

</script>
<style lang="less">
  .alarmAnalysisListContainer{
    padding-left: 5px;
    padding-right: 5px;
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
