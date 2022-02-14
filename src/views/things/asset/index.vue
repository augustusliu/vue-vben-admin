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
              icon: 'clarity:info-standard-line',
              tooltip: '查看资产详情',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'ant-design:cluster-outlined',
              tooltip: '资产关系图',
              onClick: handleRelation.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑资产信息',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此资产',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <AssetDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import {BasicTable, TableAction, useTable} from '/@/components/Table';
  import { listAssetApi } from '/@/api/things/asset/assetApi';
  import { assetColumn, searchFormSchema } from "/@/views/things/asset/asset.data";
  import { useGo } from '/@/hooks/web/usePage';
  import { useDrawer } from '/@/components/Drawer';
  import AssetDrawer from "./AssetDrawer.vue";

  // 定义当前组件
  export default defineComponent({
    // 组件名称
    name: 'AssetComponent',
    // 当前依赖的组件
    components: { BasicTable, TableAction, AssetDrawer },

    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const go = useGo();
      // 定义当前要展示的表格
      const [registerTable, { reload }] = useTable({
        // title: '资产列表',
        api: listAssetApi,
        columns: assetColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: searchFormSchema,
        },
        showTableSetting: true,
        bordered: true,
        showIndexColumn: true,
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
      // 删除操作
      function handleDelete(record: Recordable) {
      }
      // 查看详情
      function handleView(record: Recordable){
        go('/asset_detail/' + record.id );
      }

      function handleRelation(record: Recordable){

      }
      function handleSuccess() {
        reload()
      }

      return {
        registerDrawer,
        registerTable,
        handleCreate,
        handleView,
        handleEdit,
        handleDelete,
        handleRelation,
        handleSuccess,
      };
    },
  });
</script>
