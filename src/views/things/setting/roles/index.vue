<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新建角色 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              // disabled: (record.systemDefault && record.systemDefault === true),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
                // disabled: (record.systemDefault && record.systemDefault === true),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <RoleDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { message } from 'ant-design-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  // 创建OR编辑弹框
  import RoleDrawer from './RoleDrawer.vue';
  // 依赖接口
  import { listAuthorityWithPager, deleteAuthority } from '/@/api/things/roles/roleApi';
  import { authorityColumn, authoritySearchFormSchema } from './roles.data';
  import { useDrawer } from '/@/components/Drawer';

  // 定义当前组件
  export default defineComponent({
    // 组件名称
    name: 'CustomerManagement',
    // 当前依赖的组件
    components: { BasicTable, TableAction, RoleDrawer },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      // 定义当前要展示的表格
      const [registerTable, { reload }] = useTable({
        title: '角色列表',
        api: listAuthorityWithPager,
        columns: authorityColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 80,
          schemas: authoritySearchFormSchema,
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
      async function handleDelete(record: Recordable) {
        // if(!record.systemDefault){
        //
        // }else{
        //   message.error('系统角色无法删除');
        // }
        await deleteAuthority(record.id);
        await reload();
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
