<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    title="实体关系维护"
    @visible-change="handleVisibleChange">

    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" :model="formData"/>
    </div>
  </BasicModal>
</template>
<script lang="ts">
  import {defineComponent, nextTick, ref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import {BasicForm, FormSchema, useForm} from "/@/components/Form";
  const schemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: '实体名称',
      componentProps: { disabled: true },
      colProps: {
        span: 20,
      },
    },
    {
      field: 'id',
      component: 'Input',
      label: '主键',
      colProps: {
        span: 20,
      },
    },
  ];

  export default defineComponent({
    components: { BasicModal, BasicForm },
    props: {
      entityData: {
        type: Object as PropType<any>,
        default: () => ({}),
      }
    },
    setup(props) {
      const formData = ref([]);
      const [ registerForm] = useForm({
        labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });

      const [register ] = useModalInner();

      function onDataReceive(data) {
        console.log(data);
      }

      function handleVisibleChange(v) {
        v && props.entityData && nextTick(() => onDataReceive(props.entityData));
      }

      return { registerForm, register, formData, handleVisibleChange }
    }
  });
</script>
