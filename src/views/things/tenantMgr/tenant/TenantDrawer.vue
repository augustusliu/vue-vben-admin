<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="700px"
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
  import { createOrUpdateFormSchema } from './tenant.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { createOrUpdateTenantApi } from '/@/api/things/tenant/tenantApi';
  import { listAreas, listIndustryAll } from '/@/api/things/common/commonApi';

  export default defineComponent({
    name: 'TenantAddOrUpdateDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const [registerForm, { resetFields, setFieldsValue, validate, updateSchema }] = useForm({
        labelWidth: 90,
        schemas: createOrUpdateFormSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ loading: true });
        await resetFields();

        isUpdate.value = !!data?.isUpdate;

        // 获取地区、行业、角色列表
        let areaData = await listAreas();
        let industryData = await listIndustryAll();
        await updateSchema({
          field: 'areaCode',
          componentProps: {
            dropdownStyle: { maxHeight: 270, overflow: 'auto'},
            options: areaData,
          },
        });

        await updateSchema({
          field: 'industryCode',
          componentProps: {
            dropdownStyle: { maxHeight: 270, overflow: 'auto'},
            options: industryData,
          },
        });

        // 赋值
        if (unref(isUpdate)) {
          await setFieldsValue({
            ...data.record,
          });
          // 更新角色回显数据
          await updateSchema({
            field: 'authorityId',
            componentProps: {
              immediate: true,
              params: {
                id: data.record.authorityId,
                enabled: true,
              },
            },
          });
        }
        setDrawerProps({ loading: false, confirmLoading: false });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增租户' : '编辑租户'));

      // function onChangeIndustry(value, selectedOptions){
      //   if(value || value.length > 0){
      //     const targetOption = selectedOptions[selectedOptions.length - 1];
      //     targetOption.loading = true;
      //     listIndustryByParent(targetOption.code).then((data)=>{
      //       targetOption.children = data;
      //       targetOption.loading = false;
      //     })
      //   }
      // }

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          await createOrUpdateTenantApi(values);
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
