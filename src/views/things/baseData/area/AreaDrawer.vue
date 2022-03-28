<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="40%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { areaCreateOrUpdateFormSchema } from './area.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { addArea, updateArea, listAllArea } from '/@/api/things/baseData/areaApi';

  export default defineComponent({
    name: 'AreaDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: areaCreateOrUpdateFormSchema,
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

        const areaData = await listAllArea();
        // 动态设置某个字段的值
        await updateSchema({
          field: 'parent',
          componentProps: {
            treeData: areaData,
            dropdownStyle: { maxHeight: 200, overflow: 'auto'},
            dropdownClassName: 'area-tree-select',
          },
        });
        setDrawerProps({ confirmLoading: false, loading:false });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增区域' : '编辑区域'));
      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          if(isUpdate.value){
            await updateArea(values);
          }else{
            await addArea(values);
          }
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
        handleSubmit };
    },
  });
</script>

<style lang="less">
  .area-tree-select {
    max-height: 200px;
  }
</style>
