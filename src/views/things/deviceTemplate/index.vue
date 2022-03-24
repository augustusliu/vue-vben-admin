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
    <DeviceTemplateDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listTemplateWithPager, delTemplate } from '/@/api/things/asset/templateApi';
  import { useDrawer } from '/@/components/Drawer';
  import DeviceTemplateDrawer from './DeviceTemplateDrawer.vue';
  import { templateColumn, templateSearchScheme } from './template.data';

  export default defineComponent({
    name: 'EntityGroupManagement',
    components: { BasicTable, DeviceTemplateDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        title: '物模型列表',
        api: listTemplateWithPager,
        columns: templateColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: templateSearchScheme,
        },
        showTableSetting: true,
        tableSetting: {
          redo: true,
          size: false,
          setting: false,
          fullScreen: false,
        },
        bordered: true,
        showIndexColumn: false,
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
        await delTemplate(record.id)
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
