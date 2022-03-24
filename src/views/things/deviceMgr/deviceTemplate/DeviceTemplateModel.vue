<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModel"
    :title="getTitle"
    :canFullscreen=false
    @ok="handleSubmit"
  >
    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm">
        <template #menu="{ model, field }"></template>
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {BasicForm, useForm} from '/@/components/Form';
  import { templateAddOrUpdateFormSchema } from './template.data';
  import { addOrUpdateTemplate } from '/@/api/things/asset/templateApi';

  export default defineComponent({
    name: 'EntityGroupAddOrUpdateModel',
    components: { BasicModal, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: templateAddOrUpdateFormSchema,
        showActionButtonGroup: false,
      });

      const [registerModel, {changeLoading, closeModal}] = useModalInner((data) => {
        resetFields()
        changeLoading(false);
        isUpdate.value = !!data?.isUpdate;
        if (unref(isUpdate)) {
          setFieldsValue(data.record);
        }
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增物模型' : '编辑物模型'));

      async function handleSubmit() {
        try {
          const values = await validate();
          changeLoading(true);
          await addOrUpdateTemplate(values);
          closeModal();
          emit('success');
        } finally {
          changeLoading(false);
        }
      }

      return {
        registerModel,
        registerForm,
        getTitle,
        handleSubmit,
      };
    },
  });
</script>
