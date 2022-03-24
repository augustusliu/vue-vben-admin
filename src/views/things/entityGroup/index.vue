<template>
  <div>
    <BasicTable @register="registerTable"
                @fetch-success="onFetchSuccess"
                :onExpand="handleOnExpand">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增字典 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
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
    <EntityGroupDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listEntityGroupByPager, delEntityGroup } from '/@/api/things/entityGroup/entityGroupApi';
  import { useDrawer } from '/@/components/Drawer';
  import EntityGroupDrawer from './EntityGroupDrawer.vue';
  import { entityGroupColumn, deviceGroupSearchScheme } from './entityGroup.data';

  export default defineComponent({
    name: 'EntityGroupManagement',
    components: { BasicTable, EntityGroupDrawer, TableAction },
    setup() {
      const groupEntityType = 'DEVICE'; //当前界面时默认设备分组界面
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: '设备分组列表',
        api: listEntityGroupByPager,
        beforeFetch: (param: any) => { param.entityType = groupEntityType },
        columns: entityGroupColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: deviceGroupSearchScheme,
        },
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
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
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

      async function handleDelete(record: Recordable) {
        await delEntityGroup(record.id)
        reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete
      };
    },
  });
</script>
