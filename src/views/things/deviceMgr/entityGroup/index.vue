<template>
  <div>
    <BasicTable @register="registerTable"
                @fetch-success="onFetchSuccess"
                :onExpand="handleOnExpand">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新增设备分组 </a-button>
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
    <EntityGroupModel @register="registerModel" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listEntityGroupByPager, delEntityGroup } from '/@/api/things/entityGroup/entityGroupApi';
  import EntityGroupDrawer from './EntityGroupDrawer.vue';
  import EntityGroupModel from './EntityGroupModel.vue';
  import { entityGroupColumn, deviceGroupSearchScheme } from './entityGroup.data';
  import { useModal } from "/@/components/Modal";

  export default defineComponent({
    name: 'EntityGroupManagement',
    components: { BasicTable, EntityGroupDrawer, TableAction, EntityGroupModel },
    setup() {
      const groupEntityType = 'DEVICE'; //当前界面时默认设备分组界面
      const [registerModel, { openModal }] = useModal();

      const [registerTable, { reload }] = useTable({
        title: '设备分组列表',
        api: listEntityGroupByPager,
        beforeFetch: (param: any) => { param.entityType = groupEntityType },
        columns: entityGroupColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 80,
          schemas: deviceGroupSearchScheme,
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
        canResize: true, // 调整表格自动高度
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      });

      function handleCreate() {
        openModal(true, {
          isUpdate: false,
        });
      }

      function handleEdit(record: Recordable) {
        openModal(true, {
          record: record,
          isUpdate: true,
        });
      }

      async function handleDelete(record: Recordable) {
        await delEntityGroup(record.id)
        await reload();
      }

      function handleSuccess() {
        reload()
      }
      return {
        registerTable,
        registerModel,
        openModal,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
      };
    },
  });
</script>
