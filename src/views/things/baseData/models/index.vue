<template>
  <PageWrapper class="h-full w-full">
    <div>
      <BasicTable @register="registerTable">
        <template #toolbar>
          <BasicUpload
            :maxSize="512"
            :maxNumber="5"
            :accept="acceptArray"
            @change="handleUploadChange"
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
                icon: 'clarity:note-edit-line',
                onClick: handleEdit.bind(null, record),
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
    <ModelDrawer @register="registerDrawer" @success="handleEditSuccess"/>
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, ref } from 'vue';
  import { BasicUpload } from '/@/components/Upload';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { modelsColumns , searchFormSchema } from "/@/views/things/baseData/models/model.data";
  import { Loading } from '/@/components/Loading';
  import {ModelSyncAssetRequest} from "/@/views/things/baseData/models/ModelSyncAssetRequest";
  import { useMessage } from '/@/hooks/web/useMessage';
  import ModelDrawer from './ModelDrawer.vue';

  import {
    deleteModelApi,
    searchModelByPager,
    addModelInfo,
  } from "/@/api/things/baseData/modelApi";
  import {
    uploadModelApi
  } from "/@/api/things/common/commonApi";
  import {PageWrapper} from "/@/components/Page";
  import {useDrawer} from "/@/components/Drawer";

  export default defineComponent({
    name: 'ModelComponent',
    components: {TableAction, BasicTable, BasicUpload, Loading, PageWrapper, ModelDrawer},
    setup(){
      const [registerDrawer, { openDrawer }] = useDrawer();
      const acceptArray = ['glb', 'gltf'];
      const loading = ref(false);
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
          width: 120,
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

      async function handleUploadChange(list: any[]){
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

      function handleEdit(record: Recordable){
        openDrawer(true, {
          record,
          isUpdate: true,
        });
      }

      async function handleEditSuccess(){
        await reload();
      }

      async function handleConvertAsset(record: Recordable){
        loading.value = true;
         if(!record.syncAsset){
           new ModelSyncAssetRequest().loadModel(record.id, closeLoading);
         }else{
           useMessage().createMessage.error('该模型资产已同步');
         }
      }

      const closeLoading = () => {
        loading.value = false;
        reload();
      }

      return {registerTable, registerDrawer, uploadModelApi, handleUploadChange, acceptArray, handleEdit,
        handleDelete, handleConvertAsset, loading, handleEditSuccess};
    },
  });
</script>
