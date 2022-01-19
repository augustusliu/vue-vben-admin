<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新建资产 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'ant-design:eye-outlined',
              color: 'warning',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              onClick: handleDetail.bind(null, record),
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
  import { BasicTable, TableAction } from '/@/components/Table';
  import { useDrawer } from '/@/components/Drawer';

  // 定义当前组件
  export default defineComponent({
    // 组件名称
    name: 'CustomerManagement',
    // 当前依赖的组件
    components: { BasicTable, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      // 定义当前要展示的表格

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

      }
      // 查看详情
      function handleDetail(record: Recordable){

      }
      function handleSuccess() {
      }

      return {
        registerDrawer,
        handleCreate,
        handleDetail,
        handleEdit,
        handleDelete,
        handleSuccess,
      };
    },
  });
</script>
