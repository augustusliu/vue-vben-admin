<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新建属性 </a-button>
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
                // confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <AttributeDrawer @register="registerDrawer" @success="handleSuccess" :entityId="entityId" />
  </div>
</template>

<script lang="ts">
  import {defineComponent} from 'vue';
  import {BasicTable, useTable, TableAction, FormSchema, FormSchema} from '/@/components/Table';

  // 依赖接口
  import { listAttributeByAssetApi } from '/@/api/things/asset/assetApi';
  import { attributeColumn } from './attribute.data';
  import { useDrawer } from '/@/components/Drawer';
  import AttributeDrawer from  './AttributeDrawer.vue';
  import {searchFormSchema} from "/@/views/things/customer/customer.data";

  export default defineComponent({
    // 组件名称
    name: 'EntityAttributes',
    // 当前依赖的组件
    components: { BasicTable, TableAction, AttributeDrawer },
    props:["entityId"],
    setup(props) {
      const entityId = props.entityId;
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerTable, { reload }] = useTable({
        api: listAttributeByAssetApi,
        columns: attributeColumn,
        bordered: true,
        showIndexColumn: true,
        beforeFetch: (record) => { record.assetId = entityId; return record},
        actionColumn: {
          width: 100,
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

      function handleSuccess() {
        reload();
      }

      return {
        entityId,
        registerTable,
        registerDrawer,
        handleCreate,
        handleEdit,
        handleSuccess,
      };
    }
  });

</script>
