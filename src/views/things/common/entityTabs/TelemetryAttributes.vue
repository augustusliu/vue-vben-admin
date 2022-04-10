<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar >
        <Switch v-model:checked="autoTelemetry" checkedChildren="自动遥测" unCheckedChildren="手动遥测" :onChange="autoTelemetryChange"/>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref, unref, watchEffect} from 'vue';
  import {BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Switch } from 'ant-design-vue';
  import { useWebSocket } from '@vueuse/core';
  import { EntityTypeEnum } from "/@/enums/entityEnum";
  import { listEntityTelemetry, getAttributeTelemetryWsApi } from '/@/api/things/attribute/attrApi';
  import { telemetryAttributeColumns, telemetryAttributeColumnsWithDevice } from './telemetryAttribute.data';

  export default defineComponent({
    // 组件名称
    name: 'TelemetryAttributes',
    // 当前依赖的组件
    components: { BasicTable, TableAction, Switch },
    props:["entityId", "entityType"],
    setup(props) {
      const entityId = props.entityId;
      const entityType = props.entityType;
      const autoTelemetry = ref(false);
      // 配置web socket
      const wsUrl = getAttributeTelemetryWsApi(entityId);
      // 定义一个ws的对象，保存ws的连接地址
      const wsState = ref({
        server: wsUrl,
        sendValue: '',
        receiveRecord: [] as { nodeId: number; nodeName: string; message: string }[],
      });
      // 注册ws对象
      const {data, close, open } = useWebSocket(unref(wsState).server, {
        autoReconnect: false,
        heartbeat: true,
        immediate: false,
        autoClose: false,
      });

      // 基于不同的类型，显示不同的列
      const tableColumns = entityType === EntityTypeEnum.ASSET ? telemetryAttributeColumnsWithDevice: telemetryAttributeColumns;
      const [registerTable, { reload }] = useTable({
        api: listEntityTelemetry,
        columns: tableColumns,
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
        beforeFetch: (record) => { record.entityId = entityId; record.entityType = entityType; return record},
      });

      const autoTelemetryChange = (checked: boolean) => {
        autoTelemetry.value = checked;
        if(checked){
          open();
        }else{
          close();
        }
      }
     // web socket 数据监听, 如果监听到属性变化事件，则更新
      watchEffect(() => {
        if (data.value) {
          try {
            const res = JSON.parse(data.value);
            // 清空ws 流中的数据，否则会死循环调用
            data.value = null;
            if(res && res.telemetryType === 'ATTRIBUTE'){
              reload();
            }
          } catch (error) {
            console.log('ws parse error', error)
          }
          return;
        }
      });


      return {
        entityId,
        entityType,
        registerTable,
        autoTelemetry,
        autoTelemetryChange,
      };
    }
  });

</script>

