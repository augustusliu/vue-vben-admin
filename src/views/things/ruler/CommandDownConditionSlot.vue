<template>
  <BasicTable
    :value="getValues"
    @register="registerTable"
    @edit-end="handleEditSuccess"
    @selection-change="handleRowSelect"
  />
</template>

<script lang="ts">
  import {defineComponent, ref, unref, watchEffect} from 'vue';
  import { BasicTable, useTable, BasicColumn } from '/@/components/Table';
  import { listAllCommand } from "/@/api/things/command/commandApi";

  const commandColumns: BasicColumn[] = [
    {
      title: 'id',
      dataIndex: 'id',
      edit: false,
      width: 20,
      defaultHidden: true
    },
    {
      title: '指令名称',
      dataIndex: 'name',
      edit: false,
      width:130
    },
    {
      title: '指令编码',
      dataIndex: 'code',
      width: 130
    },
    {
      title: '下发指令',
      dataIndex: 'lastValue',
      edit: true
    },
  ];

  // 下发指令定义
  export type SendCommands = {
    id: number,
    code: string,
    name?: string,
    distributeValue: string,  // 下发指令值
  };

  export default defineComponent({
    name: 'CommandDownConditionSlot',
    components: { BasicTable },
    props: ['entityId', 'entityType'],
    emits: ['change', 'update:value'],
    setup(props, {emit}) {
      const refEntityId = ref(null);
      const refEntityType = ref(null);
      // 缓存当前配置的下发指令信息
      const distributeCommands = ref<SendCommands[]>([]);
      refEntityId.value = props.entityId;
      refEntityType.value = props.entityType;
      const [registerTable, {reload}] = useTable({
        api: listAllCommand,
        columns: commandColumns,
        showIndexColumn: false,
        bordered: true,
        canResize: false,
        pagination: false,
        maxHeight: 400,
        rowSelection: { type: 'checkbox' },
        beforeFetch: (params) => {
          params.entityId = refEntityId.value;
          params.entityType = refEntityType.value;
          return params;
        }
      });

      watchEffect(() => {
        if (props.entityId !== refEntityId.value) {
          try {
            refEntityId.value = props.entityId
            refEntityType.value = props.entityType;
            reload();
          } catch (error) {
            console.log('command parse error', error)
          }
        }
      });

      function handleRowSelect(callData){
        unref(distributeCommands).splice(0, unref(distributeCommands).length) ;
        callData.rows.forEach(item => {
          unref(distributeCommands).push({
            id: item.id,
            code: item.code,
            name: item.name,
            distributeValue: item.lastValue,
          })
        })

        emit('change', unref(distributeCommands));
        emit('update:value', unref(distributeCommands));
      }

      function handleEditSuccess({ record, value }: Recordable) {
        record.lastValue = value;
      }

      const getValues =() => {
        return distributeCommands.value;
      }

      return {
        registerTable,
        handleEditSuccess,
        handleRowSelect,
        getValues,
      };
    },
  });
</script>

<style lang="less">
  .vben-basic-table .ant-table-wrapper{
    padding: 0px 0px;
  }
  .vben-basic-table .ant-table-wrapper{
    padding: 0px 0px;
  }
  .ant-table{
    font-size: 12px;
  }
  .ant-table-fixed, .ant-table-thead{
    height: 30px;
  }
  .ant-table-thead tr{
    height: 20px;
  }
</style>
