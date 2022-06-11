<template>
  <div>
    <BasicTable @register="registerDeviceBindTable">
        <template #toolbar>
          <Select
            size="small"
            defaultValue="true"
            style="width: 140px"
            :options = "optionsRef"
            :onChange="deviceBoundStateChanged"/>
            <a-input style="width: 200px" size="small"
                   placeholder="设备查询"
                   enterButton="查询"
                   :onChange="searchTextChange"
                   allowClear/>
        </template>
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                icon: 'ant-design:link-outlined',
                onClick: handleBound.bind(null, record),
                tooltip:'绑定',
              },
              {
                icon: 'ant-design:disconnect-outlined',
                onClick: handleUnBound.bind(null, record),
                tooltip:'解绑',
              },
            ]"
          />
        </template>
    </BasicTable>
  </div>
</template>
<script lang="ts">
  import { defineComponent, ref } from "vue";
  import {BasicTable, useTable, TableAction} from "/@/components/Table";
  import {selectDeviceColumn} from "/@/views/things/common/entityTabs/deviceSelect.data";
  import {Input, Select} from "ant-design-vue";
  import {listDevicesWithEntityRelation} from "/@/api/things/device/deviceApi";
  import {relationAddOrUpdate, relationUnbound} from "/@/api/things/relation/relationApi";

  export default defineComponent({
    name: 'DeviceSelectComponent',
    components: { BasicTable,TableAction, Input, Select},
    props:['entityId', 'entityType'],
    setup(props){
      // 输入框
      const optionsRef = ref([
        {
          label: '已绑定',
          value: "true"
        },
        {
          label: '未绑定',
          value: "false"
        }
      ]);
      const currentSearchValue = ref(null);
      const currentSelectBounded = ref(true);
      const [registerDeviceBindTable, { reload }] = useTable({
        title: '',
        api: listDevicesWithEntityRelation,
        beforeFetch: (params) => {
          params.deviceName = currentSearchValue.value ;
          params.entityId = props.entityId;
          params.entityType = props.entityType;
          params.bounded = currentSelectBounded.value;
        },
        columns: selectDeviceColumn,
        useSearchForm: false,
        pagination: true,
        striped: false,
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
        rowKey: 'id',
        actionColumn: {
          width: 80,
          title: '操作',
          dataIndex: 'action',
          slots: { customRender: 'action' },
          fixed: 'right',
        },
      });

      async function handleBound(record: Recordable){
        await relationAddOrUpdate({
          fromEntityId: props.entityId,
          fromEntityType: props.entityType,
          toEntityId: record.id,
          toEntityType:'DEVICE',
          relationType:'CONTAIN'
        });
        await reload();
      }

      async function handleUnBound(record: Recordable){
        await relationUnbound({
          fromEntityId: props.entityId,
          fromEntityType: props.entityType,
          toEntityId: record.id,
          toEntityType:'DEVICE',
          relationType:'CONTAIN'
        });
        await reload();
      }

      async function deviceBoundStateChanged(value){
        currentSelectBounded.value = value;
        await reload();
      }

      // 动态获取当前搜索框的值
      function searchTextChange(e){
        currentSearchValue.value = e.target.value;
        console.log(e.target.value);
      }

      return { registerDeviceBindTable, searchTextChange,deviceBoundStateChanged,
        optionsRef, currentSelectBounded,
        handleBound, handleUnBound};
    }
  })
</script>
