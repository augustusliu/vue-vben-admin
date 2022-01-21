<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="handleCreate"> 新建设备 </a-button>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              tooltip: '查看设备详情',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑设备信息',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除此设备',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>
    </BasicTable>
    <DeviceDrawer @register="registerDrawer" @success="handleSuccess" />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import {BasicTable, TableAction, useTable} from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';
  import { useDrawer } from '/@/components/Drawer';
  import { deviceTableColumn, deviceSearchScheme } from "./device.data";
  import { listDeviceWithPageApi, delDeviceApi } from '/@/api/things/device/deviceApi';

  import DeviceDrawer from "./DeviceDrawer.vue";

  // 定义当前组件
  export default defineComponent({
    // 组件名称
    name: 'DeviceComponent',
    // 当前依赖的组件
    components: { BasicTable, TableAction, DeviceDrawer },

    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const go = useGo();
      // 定义当前要展示的表格
      const [registerTable, { reload }] = useTable({
        title: '资产列表',
        api: listDeviceWithPageApi,
        columns: deviceTableColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 120,
          schemas: deviceSearchScheme,
        },
        showTableSetting: true,
        bordered: true,
        showIndexColumn: true,
        actionColumn: {
          width: 120,
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
        delDeviceApi(record.id);
        reload();
      }
      // 查看详情
      function handleView(record: Recordable){
        go('/asset_detail/' + record.id );
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
        handleSuccess,
      };
    },
  });
</script>
