<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              icon: 'clarity:info-standard-line',
              onClick: handleView.bind(null, record),
            },
            {
              icon: 'clarity:note-edit-line',
              onClick: handleEdit.bind(null, record),
              disabled: (record.alarmStatus && record.alarmStatus === true),
            },
          ]"
        />
      </template>
    </BasicTable>
    <AlarmConfirmModel @register="registerModel" @success="handleModelSuccess"/>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listAlarmApi } from '/@/api/things/alarm/alarmApi';
  import { alarmSearchFormSchema, alarmUnDealColumn } from './alarm.data';
  import AlarmConfirmModel from "./AlarmConfirmModel.vue";
  import {useModal} from "/@/components/Modal";
  import {useGo} from "/@/hooks/web/usePage";

  export default defineComponent({
    // 组件名称
    name: 'ThingsAlarmComponent',
    // 当前依赖的组件
    components: { BasicTable, TableAction, AlarmConfirmModel },
    setup(){
      const go = useGo();
      const [registerModel, { openModal, closeModal }] = useModal();
      const [registerTable, { reload }] = useTable({
        title: '告警列表',
        api: listAlarmApi,
        columns: alarmUnDealColumn,
        useSearchForm: true,
        formConfig: {
          labelWidth: 90,
          schemas: alarmSearchFormSchema,
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
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      });

      function handleModelSuccess(){
        closeModal();
        reload();
      }

      function handleView(record:Recordable) {
        go('/alarm_detail/' + record.id );
      }
      function handleEdit(record:Recordable) {
        openModal(true, record);
      }

      return {registerTable, handleEdit, handleView, registerModel, handleModelSuccess};
    }
  })

</script>
