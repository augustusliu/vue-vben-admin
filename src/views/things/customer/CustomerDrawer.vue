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
  import { createOrUpdateFormSchema } from './customer.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { createOrUpdateCustomerApi } from '/@/api/things/customer/customerApi';
  import {listAreas, listIndustryByParent} from "/@/api/things/common/commonApi";

  export default defineComponent({
    name: 'CustomerAddOrUpdateDrawer',
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
        setDrawerProps({ confirmLoading: false, loading: true });
        await resetFields();

        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          await setFieldsValue({
            ...data.record,
          });
        }

        // 获取地区信息
        let areaData = await listAreas();
        let industryData = await listIndustryByParent('0');
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
            changeOnSelect: true,
            onChange: onChangeIndustry,
          },
        });
        setDrawerProps({ confirmLoading: false, loading: false });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增客户' : '编辑客户'));

      function onChangeIndustry(value, selectedOptions){
        if(value || value.length > 0){
          const targetOption = selectedOptions[selectedOptions.length - 1];
          targetOption.loading = true;
          listIndustryByParent(targetOption.code).then((data)=>{
            targetOption.children = data;
            targetOption.loading = false;
          })
        }
      }

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          await createOrUpdateCustomerApi(values);
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
