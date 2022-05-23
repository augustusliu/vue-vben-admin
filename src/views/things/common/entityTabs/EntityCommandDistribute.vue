<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar >
        <a-button type="primary" @click="handleCreate" v-if="createBtnShow"> 远程控制 </a-button>
      </template>
    </BasicTable>
    <IssueCommandDrawer @register="registerDrawer" @success="handleSuccess" :entityId="entityId" :entityType="entityType" />
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import {BasicTable, useTable, TableAction } from '/@/components/Table';
  import {IssueOrAttrType} from '/@/enums/IssueOrAttrTypeEnum';
  import IssueCommandDrawer from './IssueCommandDrawer.vue';
  // 依赖接口
  import {
    issueDeviceCommandColumn,
    issueAssetCommandColumn,
  } from './issue.data';
  import {listIssuePagerApi} from "/@/api/things/device/deviceApi";
  import {useDrawer} from "/@/components/Drawer";
  import {EntityTypeEnum} from "/@/enums/entityEnum";

  export default defineComponent({
    // 组件名称
    name: 'EntityCommandDistribute',
    // 当前依赖的组件
    components: { BasicTable, TableAction, IssueCommandDrawer },
    props:["entityId", "entityType"],
    setup(props) {
      const entityId = props.entityId;
      const entityType = props.entityType;
      const [registerDrawer, { openDrawer }] = useDrawer();
      const createBtnShow = (entityType === EntityTypeEnum.DEVICE);
      const tableColumns = entityType === EntityTypeEnum.ASSET ? issueAssetCommandColumn: issueDeviceCommandColumn;
      // 用户控制是否可以添加属性，只有设备才可以添加属性，资产的属性是采用的设备的属性
      const [registerTable, { reload }] = useTable({
        api: listIssuePagerApi,
        columns: tableColumns,
        showTableSetting: false,
        tableSetting: {
          redo: true,
          size: false,
          setting: false,
          fullScreen: false,
        },
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
  });

</script>
