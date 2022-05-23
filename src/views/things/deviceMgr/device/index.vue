<template>
  <div>
    <CardsTable @register="registerTable">
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
              icon: 'ant-design:dot-chart-outlined',
              tooltip: '实时监控',
              onClick: handleMonitor.bind(null, record),
            },
            {
              icon: 'ant-design:lock-outlined',
              tooltip: '查看设备秘钥',
              onClick: showCredentials.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑设备信息',
              onClick: handleEdit.bind(null, record),
            },
            {
              icon: 'ant-design:delete-outlined',
              color: 'error',
              tooltip: '删除设备信息',
              popConfirm: {
                title: '是否确认删除',
                confirm: handleDelete.bind(null, record),
              },
            },
          ]"
        />
      </template>

      <!--   3、为CardList定义card的内容  -->
      <template #cardContent="{ record }">
        <DeviceCardContentSlot :dataInfo="record"/>
      </template>


      <!--   4、为CardList定义事件插槽  ， # 是v-slot的简写, 子组件传递的参数都会放入到data中 -->
      <template #cardAction="{ record }">
        <Row style="height: 30px; border-top: 1px solid #f0f0f0">
          <Col :span="6" style="text-align: center; line-height: 30px; border-right: 1px solid #f0f0f0;">
            <InfoCircleOutlined style="color:#3076c6" :onClick="handleView.bind(null, record)"/>
          </Col>

          <Col :span="6" style="text-align: center; line-height: 30px; border-right: 1px solid #f0f0f0;">
            <LockOutlined style="color:#3076c6" :onClick="showCredentials.bind(null, record)"/>
          </Col>

          <Col :span="6" style="text-align: center;line-height: 30px; border-right: 1px solid #f0f0f0;">
            <EditOutlined style="color:#3076c6" :onClick="handleEdit.bind(null, record)"/>
          </Col>
          <Col :span="6" style="text-align: center; line-height: 30px">
            <DeleteOutlined style="color:#3076c6" :onClick="handleDelete.bind(null, record)"/>
          </Col>
        </Row>
      </template>


    </CardsTable>
    <DeviceDrawer @register="registerDrawer" @success="handleSuccess" />
    <CredentialsModel @register="registerModel"/>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { EditOutlined, InfoCircleOutlined,DeleteOutlined,LockOutlined } from '@ant-design/icons-vue';
  import {BasicTable, CardsTable, TableAction, useTable} from '/@/components/Table';
  import { useGo } from '/@/hooks/web/usePage';
  import { useDrawer } from '/@/components/Drawer';
  import DeviceCardContentSlot from './DeviceCardContentSlot.vue';
  import { deviceTableColumn, deviceSearchScheme } from "./device.data";
  import { listDeviceWithPageApi, delDeviceApi } from '/@/api/things/device/deviceApi';
  import DeviceDrawer from "./DeviceDrawer.vue";
  import CredentialsModel from "./CredentialsModel.vue";
  import { useModal } from "/@/components/Modal";
  import {Col, Row} from "ant-design-vue";
  // 定义当前组件
  export default defineComponent({
    // 组件名称
    name: 'DeviceComponent',
    // 当前依赖的组件
    components: { CardsTable,BasicTable, TableAction, DeviceDrawer, CredentialsModel, DeviceCardContentSlot, Row, Col,
      EditOutlined, InfoCircleOutlined,DeleteOutlined,LockOutlined},

    setup() {
      const [registerDrawer, { openDrawer }] = useDrawer();
      const [registerModel, { openModal }] = useModal();
      const go = useGo();
      // 定义当前要展示的表格
      const [registerTable, { reload }] = useTable({
        title: '设备列表',
        api: listDeviceWithPageApi,
        columns: deviceTableColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 80,
          schemas: deviceSearchScheme,
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
        canResize: true,
        actionColumn: {
          width: 200,
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

      function showCredentials(record: Recordable){
        openModal(true, {"deviceId":record.id});
      }

      // 查看详情
      function handleView(record: Recordable){
        go('/device_detail/' + record.id );
      }

      function handleMonitor(record: Recordable){
        go('/device_monitor/' + record.id );
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
        registerModel,
        openModal,
        showCredentials,
        handleSuccess,
        handleMonitor,
      };
    },
  });
</script>
