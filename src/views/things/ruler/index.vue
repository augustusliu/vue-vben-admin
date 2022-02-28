<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新建规则 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑规则',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除规则',
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
  import { listAllRuleChainApi } from '/@/api/things/ruler/ruleApi';
  import { ruleChainColumn, searchFormSchema } from './rulechain.data';
  import { SvgIcon, Icon } from '/@/components/Icon';
  import { useGo } from '/@/hooks/web/usePage';

  // 定义当前组件
  export default defineComponent({
    // 组件名称
    name: 'RuleChainComponent',
    // 当前依赖的组件
    components: { BasicTable, SvgIcon, Icon, TableAction },
    setup() {
      const go = useGo();
      // 定义当前要展示的表格
      const [registerTable] = useTable({
        // title: '资产列表',
        api: listAllRuleChainApi,
        columns: ruleChainColumn,
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
        go('/rule_detail/' + '0'); // 表示新建
      }
      function handleEdit(record: Recordable) {
        go('/rule_detail/' + record.id);
      }
      // 删除操作
      function handleDelete(record: Recordable) {

      }

      return {
        registerTable,
        handleCreate,
        handleEdit,
        handleDelete,
      };
    },
  });
</script>
