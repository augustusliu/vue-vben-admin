<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新建规则模板 </a-button>
      </template>
      <!--      插槽，用于覆盖父组件中的action插槽  ，该插槽接收一个record 参数-->
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '编辑规则详情',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此模板',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, TableAction, useTable } from '/@/components/Table';
  import { listAssetApi } from '/@/api/things/asset/assetApi';
  import { assetColumn, searchFormSchema } from '/@/views/things/asset/asset.data';
  import { SvgIcon, Icon } from '/@/components/Icon';
  import { useGo } from '/@/hooks/web/usePage';

  // 定义当前组件
  export default defineComponent({
    // 组件名称
    name: 'RulerTemplate',
    // 当前依赖的组件
    components: { BasicTable, SvgIcon, Icon, TableAction },

    setup() {
      const go = useGo();
      // 定义当前要展示的表格
      const [registerTable, { reload }] = useTable({
        title: '规则模板列表',
        api: listAssetApi,
        columns: assetColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 80,
          schemas: searchFormSchema,
        },
        showTableSetting: true,
        bordered: true,
        showIndexColumn: true,
        actionColumn: {
          width: 100,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      });

      function handleCreate() {
      }

      function handleEdit(record: Recordable) {
      }
      // 删除操作
      function handleDelete(record: Recordable) {}
      // 查看详情
      function handleView(record: Recordable) {
        go('/asset_detail/' + record.id);
      }

      function handleRelation(record: Recordable) {
        go('/relation/' + record.id);
      }
      function handleSuccess() {
        reload();
      }


      return {
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
