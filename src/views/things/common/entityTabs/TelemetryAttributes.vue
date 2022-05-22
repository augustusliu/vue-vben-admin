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
  import {defineComponent, ref, onMounted, onUnmounted} from 'vue';
  import {BasicTable, useTable, TableAction } from '/@/components/Table';
  import { Switch } from 'ant-design-vue';
  import {thingsWebSocket, WebResponse} from '/@/layouts/default/header/ws/ThingsWebSocket';
  import { EntityTypeEnum } from "/@/enums/entityEnum";
  import { listEntityTelemetry } from '/@/api/things/attribute/attrApi';
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

      const attributeRealDataCallback = (data: WebResponse) => {
        if(autoTelemetry.value){
          if(entityType === EntityTypeEnum.DEVICE && entityId === data.entityId){
            reload();
          }

          if(entityType === EntityTypeEnum.ASSET && data.assetId &&  entityId === data.assetId){
            reload();
          }
        }
      }

      const autoTelemetryChange = (checked: boolean) => {
        autoTelemetry.value = checked;
      }

      function init(){
        thingsWebSocket.updateCallback({
          deviceAttributeCallbackFunc: attributeRealDataCallback
        })
        if(!thingsWebSocket.isConnected()){
          thingsWebSocket.reOpen();
        }
      }

      function cleanWS(){
        thingsWebSocket.updateCallback({
          deviceAttributeCallbackFunc: null,
        })
      }

      onMounted(init);
      onUnmounted(cleanWS);
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

