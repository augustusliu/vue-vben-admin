<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar >
        <a-button type="primary" @click="handleCreate" v-show="createBtnShow"> 新建指令 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction v-show="createBtnShow"
                     :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <CommandDrawer @register="registerDrawer" @success="handleSuccess" :entityId="entityId" :entityType="entityType" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import {BasicTable, useTable, TableAction } from '/@/components/Table';
  import { EntityTypeEnum } from "/@/enums/entityEnum";

  // 依赖接口
  import { listCommand, delCommand } from '/@/api/things/command/commandApi';
  import { commandColumn } from './command.data';
  import { useDrawer } from '/@/components/Drawer';
  import CommandDrawer from  './CommandDrawer.vue';

  export default defineComponent({
    // 组件名称
    name: 'EntityCommand',
    // 当前依赖的组件
    components: { BasicTable, TableAction, CommandDrawer },
    props:["entityId", "entityType"],
    setup(props) {
      const entityId = props.entityId;
      const entityType = props.entityType;
      // 用户控制是否可以添加属性，只有设备才可以添加属性，资产的属性是采用的设备的属性
      const createBtnShow = (entityType === EntityTypeEnum.DEVICE || entityType === EntityTypeEnum.DEVICE_TEMPLATE);
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        api: listCommand,
        columns: commandColumn,
        showTableSetting: true,
        tableSetting: {
          redo: true,
          size: false,
          setting: false,
          fullScreen: false,
        },
        bordered: true,
        showIndexColumn: true,
        canResize: false,
        beforeFetch: (record) => { record.entityId = entityId; record.entityType = entityType; return record},
        actionColumn: {
          width: 100,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
          ifShow: createBtnShow,
        },
      });

      function handleCreate() {
        openDrawer(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      function handleDelete(record: Recordable){
        delCommand(record.id);
        reload();
      }

      function handleSuccess() {
        reload();
      }

      return {
        entityId,
        entityType,
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        createBtnShow,
      };
    }
  });

</script>
