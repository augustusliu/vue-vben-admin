<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新建客户 </a-button>
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
    <CustomerAddOrUpdateDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  // 创建OR编辑弹框
  import CustomerAddOrUpdateDrawer from './CustomerDrawer.vue';
  // 依赖接口
  import { listCustomerApi, delCustomerApi } from '/@/api/things/customer/customerApi';
  import { customerColumn, searchFormSchema } from './customer.data';
  import { useDrawer } from '/@/components/Drawer';

  // 定义当前组件
  export default defineComponent({
    // 组件名称
    name: 'CustomerManagement',
    // 当前依赖的组件
    components: { BasicTable, TableAction, CustomerAddOrUpdateDrawer },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      // 定义当前要展示的表格
      const [registerTable, { reload }] = useTable({
        title: '客户列表',
        api: listCustomerApi,
        columns: customerColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        showTableSetting: true,
        bordered: true,
        showIndexColumn: true,
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
      // 删除操作
      function handleDelete(record: Recordable) {
        delCustomerApi(record.id);
        reload();
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
