<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新建租户配置 </a-button>
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
    <TenantProfileAddOrUpdateDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  // 创建OR编辑弹框
  import TenantProfileAddOrUpdateDrawer from './TenantProfileDrawer.vue';
  // 依赖接口
  import { listTenantApi } from '/@/api/things/tenant/tenantApi';
  import { tenantProfileColumn, searchFormSchema } from './tenantProfile.data';
  import { useDrawer } from '/@/components/Drawer';

  // 定义当前组件
  export default defineComponent({
    // 组件名称
    name: 'TenantProfileManagement',
    // 当前依赖的组件
    components: { BasicTable, TableAction, TenantProfileAddOrUpdateDrawer },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      // 定义当前要展示的表格
      const [registerTable, { reload }] = useTable({
        title: '租户配置列表',
        api: listTenantApi,
        columns: tenantProfileColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
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

      function handleDelete(record: Recordable) {
        console.log(record);
      }

      function handleSuccess() {
        reload();
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
      };
    },
  });
</script>
