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
  import { industryCreateOrUpdateFormSchema } from './industry.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { addIndustry, updateIndustry, listAllIndustry } from '/@/api/things/baseData/industryApi';

  export default defineComponent({
    name: 'DictionaryDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: industryCreateOrUpdateFormSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      // 注册函数，并且将数据
      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ confirmLoading: false, loading: true });
        await resetFields();
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          await setFieldsValue({
            ...data.record,
          });
        }

        const industryData = await listAllIndustry();
        // 动态设置某个字段的值
        await updateSchema({
          field: 'parentCode',
          componentProps: {
            treeData: industryData,
            dropdownStyle: { maxHeight: 200, overflow: 'auto'},
            dropdownClassName: 'industry-tree-select',
          },
        });
        setDrawerProps({ confirmLoading: false, loading: false });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增行业' : '编辑行业'));
      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          if(isUpdate.value){
            await updateIndustry(values);
          }else{
            await addIndustry(values);
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
.industry-tree-select {
  max-height: 200px;
}
</style>
