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
  import { createOrUpdateCommandSchema } from './command.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { addOrUpdateCommand } from '/@/api/things/command/commandApi';

  export default defineComponent({
    name: 'CommandDrawer',
    components: { BasicDrawer, BasicForm },
    props:["entityId", "entityType"],
    emits: ['success', 'register'],
    setup(props, { emit }) {
      const isUpdate = ref(true);
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: createOrUpdateCommandSchema,
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

      const getTitle = computed(() => (!unref(isUpdate) ? '新增指令' : '编辑指令'));

      async function handleSubmit() {
        try {
          const values = await validate();
          values.entityId = props.entityId;
          values.entityType = props.entityType;
          setDrawerProps({ confirmLoading: true });
          await addOrUpdateCommand(values);
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
