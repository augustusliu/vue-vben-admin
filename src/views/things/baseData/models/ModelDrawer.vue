<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="编辑模型"
    width="40%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import {modelUpdateFormSchema} from "/@/views/things/baseData/models/model.data";
  import {updateModelInfo} from "/@/api/things/baseData/modelApi";

  export default defineComponent({
    name: 'ModelDrawerComponent',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 100,
        schemas: modelUpdateFormSchema,
        showActionButtonGroup: false,
      });

      // 注册函数，并且将数据
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ loading: true});
        await resetFields();
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          await setFieldsValue({
            ...data.record,
          });
        }

        setDrawerProps({ confirmLoading: false,loading: false });
      });

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          await updateModelInfo({
            id: values.id,
            isEnabled: values.isEnabled,
            isMain: values.isMain,
            parentId: values.parentId
          });
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }
      return { registerDrawer, registerForm, handleSubmit };
    },
  });
</script>
