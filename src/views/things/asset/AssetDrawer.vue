<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }"></template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { createOrUpdateFormSchema } from './asset.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { addOrUpdateAsset, listAssetLabels } from '/@/api/things/asset/assetApi';

  export default defineComponent({
    name: 'AssetAddOrUpdateDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 90,
        schemas: createOrUpdateFormSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ loading: true});
        await resetFields();
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          await setFieldsValue({
            ...data.record,
          });
        }

        let labelsData = await listAssetLabels();
        await updateSchema({
          field: 'label',
          componentProps: {
            dropdownStyle: { maxHeight: 270, overflow: 'auto'},
            options: preProcessData(labelsData),
          },
        });
        setDrawerProps({ loading: false, confirmLoading: false });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增资产' : '编辑资产'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          await addOrUpdateAsset(values);
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

      return {
        registerDrawer,
        registerForm,
        getTitle,
        handleSubmit,
      };
    },
  });
</script>
