<template>
  <div>
    <BasicTable @register="registerTable"
                @fetch-success="onFetchSuccess"
                :onExpand="handleOnExpand">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增区域 </a-button>
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
    <AreaDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { searchAreaByPager, delArea, listAreaByParent } from '/@/api/things/baseData/areaApi';

  import { useDrawer } from '/@/components/Drawer';
  import AreaDrawer from './AreaDrawer.vue';
  import { areaColumn, areaSearchFormSchema } from './area.data';

  export default defineComponent({
    name: 'IndustryManagement',
    components: { BasicTable, AreaDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, collapseAll }] = useTable({
        title: '区域列表',
        api: searchAreaByPager,
        columns: areaColumn,
        formConfig: {
          labelWidth: 120,
          schemas: areaSearchFormSchema,
        },
        isTreeTable: true,
        pagination: true,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
        bordered: true,
        showIndexColumn: false,
        canResize: true, // 调整表格自动高度
        size: 'small',
        actionColumn: {
          width: 150,
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
        await delArea(record.code)
        handleSuccess()
      }

      function handleSuccess() {
        reload();
      }

      function onFetchSuccess() {
        nextTick(collapseAll);
      }
      // 级联渲染子节点
      function handleOnExpand(expanded, record: Recordable){
        listAreaByParent(record.code).then((child) => {
          record.children = child;
        });
      }

      return {
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        onFetchSuccess,
        handleOnExpand,
      };
    },
  });
</script>
