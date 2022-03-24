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
  import {defineComponent, ref, computed, unref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {BasicForm, useForm} from '/@/components/Form';
  import { createOrUpdateFormSchema } from './entityGroup.data';
  import {addOrUpdateEntityGroup} from "/@/api/things/entityGroup/entityGroupApi";

  export default defineComponent({
    name: 'EntityGroupAddOrUpdateModel',
    components: { BasicModal, BasicForm },
    props: {
      userData: { type: Object },
    },
    emits: ['success', 'register'],
    setup(_, {emit}) {
      const isUpdate = ref(true);
      const [ registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: createOrUpdateFormSchema,
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
      const getTitle = computed(() => (!unref(isUpdate) ? '新增设备分组' : '编辑设备分组'));

      async function handleSubmit() {
        try {
          const values: any = await validate();
          changeLoading(true);
          values.entityType = 'DEVICE';
          await addOrUpdateEntityGroup(values);
          closeModal();
          emit('success');
        } finally {
          changeLoading(false);
        }
      }

      return { registerModel, getTitle, registerForm, handleSubmit };
    },
  });
</script>
