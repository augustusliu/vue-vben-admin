<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar >
        <Switch v-model:checked="autoTelemetry" checkedChildren="自动遥测" unCheckedChildren="手动遥测" :onChange="autoTelemetryCommandChange"/>
      </template>
    </BasicTable>
  </div>
</template>

<script lang="ts">
  import {defineComponent, ref,onMounted, onUnmounted} from 'vue';
  import {BasicTable, useTable, TableAction } from '/@/components/Table';
  import { EntityTypeEnum } from "/@/enums/entityEnum";
  import { Switch } from 'ant-design-vue';
  import { telemetryCommandApi} from '/@/api/things/command/commandApi';
  import { commandColumnWithDevice, commandColumnWithoutDevice } from './telemetryCommand.data';
  import {thingsWebSocket, WebResponse} from "/@/layouts/default/header/ws/ThingsWebSocket";

  export default defineComponent({
    // 组件名称
    name: 'TelemetryCommand',
    // 当前依赖的组件
    components: { BasicTable, TableAction, Switch },
    props:["entityId", "entityType"],
    setup(props) {
      const entityId = props.entityId;
      const entityType = props.entityType;
      const autoTelemetry = ref(false);

      // 用户控制是否可以添加属性，只有设备才可以添加属性，资产的属性是采用的设备的属性
      const tableColumns = entityType === EntityTypeEnum.ASSET ? commandColumnWithDevice: commandColumnWithoutDevice;

      const [registerTable, { reload }] = useTable({
        api: telemetryCommandApi,
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

      const commandRealDataCallback = (data: WebResponse) => {
        if(autoTelemetry.value){
          if(entityType === EntityTypeEnum.DEVICE && entityId === data.entityId){
            reload();
          }

          if(entityType === EntityTypeEnum.ASSET && data.assetId &&  entityId === data.assetId){
            reload();
          }
        }
      }

      const autoTelemetryCommandChange = (checked: boolean) => {
        autoTelemetry.value = checked;
      }

      function init(){
        thingsWebSocket.updateCallback({
          deviceCommandCallbackFunc: commandRealDataCallback
        })
        if(!thingsWebSocket.isConnected()){
          thingsWebSocket.reOpen();
        }
      }

      function cleanWS(){
        thingsWebSocket.updateCallback({
          deviceCommandCallbackFunc: null,
        })
      }

      onMounted(init);
      onUnmounted(cleanWS);

      return {
        entityId,
        entityType,
        registerTable,
        autoTelemetry,
        autoTelemetryCommandChange,
      };
    }
  });

</script>
