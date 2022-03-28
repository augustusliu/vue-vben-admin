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
  import { createOrUpdateAttrSchema } from './attribute.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { addAttribute } from '/@/api/things/attribute/attrApi';

  export default defineComponent({
    name: 'AssetAttributeDrawer',
    components: { BasicDrawer, BasicForm },
    props:["entityId", "entityType"],
    emits: ['success', 'register'],
    setup(props, { emit }) {
      const isUpdate = ref(true);
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: createOrUpdateAttrSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ confirmLoading: false, loading: true });
        await resetFields();
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          await setFieldsValue({
            ...data.record,
          });
        }
        setDrawerProps({ confirmLoading: false, loading: false });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增属性' : '编辑属性'));

      async function handleSubmit() {
        try {
          const values = await validate();
          values.entityId = props.entityId;
          values.entityType = props.entityType;
          setDrawerProps({ confirmLoading: true });
          await addAttribute(values);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
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
