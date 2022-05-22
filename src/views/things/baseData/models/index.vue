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
              icon: 'ant-design:rotate-right-outlined',
              tooltip: '资产同步',
              onClick: handleConvertAsset.bind(null, record),
            },
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
  <Loading :loading="loading" :absolute="false" tip="同步中..." />
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicUpload } from '/@/components/Upload';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { modelsColumns , searchFormSchema } from "/@/views/things/baseData/models/model.data";
  import { Loading } from '/@/components/Loading';
  import {ModelSyncAssetRequest} from "/@/views/things/baseData/models/ModelSyncAssetRequest";
  import { useMessage } from '/@/hooks/web/useMessage';

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
    components: {TableAction, BasicTable, BasicUpload, Loading},
    setup(){
      const acceptArray = ['glb', 'gltf'];
      const loading = ref(false);
      const modelSyncAssetRequest: ModelSyncAssetRequest = new ModelSyncAssetRequest();
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
          width: 90,
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
        let listModels: any[] = [];
        list.forEach(item => {
          listModels.push({
            'modelName': item.name,
            'modelPath': item.path,
          })
        })
        await addModelInfo(listModels);
        listModels = [];
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

      async function handleConvertAsset(record: Recordable){
        loading.value = true;
         if(!record.syncAsset){
           await modelSyncAssetRequest.loadModel(record.id, closeLoading);
           await reload();
         }else{
           useMessage().createMessage.error('该模型资产已同步');
         }
      }

      const closeLoading = () => {
        loading.value = false;
      }

      return {registerTable, uploadModelApi, handleChange, acceptArray,
        handleDelete, handleEditEnd, handleConvertAsset, loading};
    },
  });
</script>
