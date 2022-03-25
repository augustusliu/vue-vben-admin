<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="600px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }"></template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import {defineComponent, ref, computed, unref} from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { createOrUpdateFormSchema } from './device.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { addOrUpdateDeviceApi, listDeviceLabels } from '/@/api/things/device/deviceApi';

  export default defineComponent({
    name: 'DeviceAddOrUpdateDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const [registerForm, { resetFields, setFieldsValue,updateSchema,  validate }] = useForm({
        labelWidth: 90,
        schemas: createOrUpdateFormSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        isUpdate.value = !!data?.isUpdate;


        // 获取设备标签
        let labelsData = await listDeviceLabels();
        await updateSchema({
          field: 'label',
          componentProps: {
            dropdownStyle: { maxHeight: 270, overflow: 'auto'},
            options: preProcessData(labelsData),
          },
        });

        if (unref(isUpdate)) {
          await recallSelectValue(data.record);
          await setFieldsValue({
            ...data.record,
          });
        }
        setDrawerProps({ confirmLoading: false });

      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增设备' : '编辑设备'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          await addOrUpdateDeviceApi(values);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      function preProcessData(nodes){
        let options:Array<any> = new Array<any>();
        nodes.forEach(item => options.push({
          label: item,
          key: item,
          value: item,
        }));
        return options;
      }

      // 回显下拉框值
      async function recallSelectValue(record: any){

        // 回显父设备
        await updateSchema({
          field: 'parentId',
          componentProps: {
            immediate: true,
            params: {
              id: record.parentId,
              isGateway: true,
            },
          },
        });

        await updateSchema({
          field: 'belongToAsset',
          componentProps: {
            immediate: true,
            params: {
              id: record.belongToAsset,
              disabled: false,
            },
          },
        });

        await updateSchema({
          field: 'deviceTemplateId',
          componentProps: {
            immediate: true,
            params: {
              id: record.deviceTemplateId,
              enabled: true,
            },
          },
        });

        await updateSchema({
          field: 'deviceGroupId',
          componentProps: {
            immediate: true,
            params: {
              id: record.deviceGroupId,
              entityType: 'DEVICE',
            },
          },
        });
      }
      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
      };
    },
  });
</script>
