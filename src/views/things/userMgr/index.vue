<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新建用户 </a-button>
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
    <UserAddOrUpdateDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  // 创建OR编辑弹框
  import UserAddOrUpdateDrawer from './UserDrawer.vue';
  // 依赖接口
  import { listUserApi, delUserApi } from '/@/api/things/userMgr/userMgrApi';
  import { userColumn, searchFormSchema } from './user.data';
  import { useDrawer } from '/@/components/Drawer';

  // 定义当前组件
  export default defineComponent({
    // 组件名称
    name: 'CustomerManagement',
    // 当前依赖的组件
    components: { BasicTable, TableAction, UserAddOrUpdateDrawer },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      // 定义当前要展示的表格
      const [registerTable, { reload }] = useTable({
        title: '用户列表',
        api: listUserApi,
        columns: userColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
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
        delUserApi(record.id);
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
