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
    <DictionaryDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, nextTick } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listDictionaryByPager, deleteDictionary, listDictionaryByParentId } from '/@/api/things/dictionary/dictionaryApi';

  import { useDrawer } from '/@/components/Drawer';
  import DictionaryDrawer from './DictionaryDrawer.vue';
  import { dictionaryColumn, dictionarySearchFormSchema } from './dictionary.data';

  export default defineComponent({
    name: 'DictionaryManagement',
    components: { BasicTable, DictionaryDrawer, TableAction },
    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload, collapseAll }] = useTable({
        title: '字典列表',
        api: listDictionaryByPager,
        columns: dictionaryColumn,
        formConfig: {
          labelWidth: 120,
          schemas: dictionarySearchFormSchema,
        },
        isTreeTable: true,
        pagination: true,
        striped: false,
        useSearchForm: true,
        showTableSetting: true,
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
        await deleteDictionary(record.id)
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
        listDictionaryByParentId(record.id).then((child) => {
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
