<template>
  <div>
    <BasicTable @register="registerTable" @edit-end="handleEditEnd">
      <template #toolbar>
        <BasicUpload
          :maxSize="512"
          :maxNumber="5"
          :accept="acceptArray"
          @change="handleChange"
          :api="uploadModelApi"
          :emptyHidePreview="false"
          class="my-5"
        />
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
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
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicUpload } from '/@/components/Upload';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { modelsColumns , searchFormSchema } from "/@/views/things/baseData/models/model.data";
  import {
    deleteModelApi,
    searchModelByPager,
    addModelInfo, changeModeMainOrEnableApi,
  } from "/@/api/things/baseData/modelApi";
  import {
    uploadModelApi
  } from "/@/api/things/common/commonApi";

  export default defineComponent({
    name: 'ModelComponent',
    components: {TableAction, BasicTable, BasicUpload},
    setup(){

      const acceptArray = ['glb', 'gltf'];
      const [registerTable, { reload }] = useTable({
        title: '模型列表',
        api: searchModelByPager,
        columns: modelsColumns,
        useSearchForm: true,
        formConfig: {
          labelWidth: 90,
          schemas: searchFormSchema,
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

      async function handleDelete(record: Recordable){
        await deleteModelApi(record.id);
        await reload();
      }

      async function handleChange(list: any[]){
        if(!list || list.length <=0 ){
          return;
        }
        const listModels: any[] = [];
        list.forEach(item => {
          listModels.push({
            'modelName': item.name,
            'modelPath': item.path,
          })
        })
        await addModelInfo(listModels);
        await reload();
      }

      async function handleEditEnd(ev){
        const param: any = {};
        if(ev.key === 'isMain'){
          param.isMain = ev.value
        }else if(ev.key === 'isEnabled'){
          param.isEnabled = ev.value
        }else{
          return ;
        }
        param.id = ev.record.id;
        await changeModeMainOrEnableApi(param);
      }

      return {registerTable, uploadModelApi, handleChange, acceptArray, handleDelete, handleEditEnd};
    },
  });
</script>
