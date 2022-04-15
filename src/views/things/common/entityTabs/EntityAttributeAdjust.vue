<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar >
        <a-button type="primary" @click="handleCreate"> 矫正属性 </a-button>
      </template>
    </BasicTable>
    <AttributeAdjustDrawer @register="registerDrawer" @success="handleSuccess" :entityId="entityId" :entityType="entityType" />
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import {BasicTable, useTable, TableAction } from '/@/components/Table';
  import {IssueOrAttrType} from '/@/enums/IssueOrAttrTypeEnum';
  import AttributeAdjustDrawer from './AttributeAdjustDrawer.vue';
  // 依赖接口
  import { issueColumn } from './issue.data';
  import {listIssuePagerApi} from "/@/api/things/device/deviceApi";
  import {useDrawer} from "/@/components/Drawer";

  export default defineComponent({
    // 组件名称
    name: 'AttributeAdjust',
    // 当前依赖的组件
    components: { BasicTable, TableAction, AttributeAdjustDrawer },
    props:["entityId", "entityType"],
    setup(props) {
      const entityId = props.entityId;
      const entityType = props.entityType;
      const [registerDrawer, { openDrawer }] = useDrawer();
      // 用户控制是否可以添加属性，只有设备才可以添加属性，资产的属性是采用的设备的属性
      const [registerTable, { reload }] = useTable({
        api: listIssuePagerApi,
        columns: issueColumn,
        showTableSetting: true,
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
          record.issueType = IssueOrAttrType.ATTRIBUTE;
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
        handleSuccess
      };
    }
  });

</script>
