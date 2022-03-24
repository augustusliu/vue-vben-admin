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
              icon: 'clarity:info-standard-line',
              tooltip: '物模型详情',
              onClick: handleView.bind(null, record),
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
    <DeviceTemplateModel @register="registerModel" @success="handleSuccess" />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listTemplateWithPager, delTemplate } from '/@/api/things/asset/templateApi';
  import DeviceTemplateModel from './DeviceTemplateModel.vue';
  import { templateColumn, templateSearchScheme } from './template.data';
  import {useModal} from "/@/components/Modal";
  import {useGo} from "/@/hooks/web/usePage";

  export default defineComponent({
    name: 'EntityGroupManagement',
    components: { BasicTable, DeviceTemplateModel, TableAction },
    setup() {
      const go = useGo();
      const [registerModel, { openModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '物模型列表',
        api: listTemplateWithPager,
        columns: templateColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: templateSearchScheme,
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
        canResize: false,
        actionColumn: {
          width: 120,
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

      // 查看详情
      function handleView(record: Recordable){
        go('/template_info/' + record.id );
      }
      async function handleDelete(record: Recordable) {
        await delTemplate(record.id)
        reload();
      }

      function handleSuccess(){
        reload();
      }

      return {
        registerTable,
        registerModel,
        handleCreate,
        handleEdit,
        handleDelete,
        handleSuccess,
        handleView
      };
    },
  });
</script>
