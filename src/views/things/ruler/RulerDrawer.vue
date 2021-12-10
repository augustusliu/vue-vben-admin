<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    :title="getTitle"
    width="50%"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm" />
  </BasicDrawer>
</template>
<script lang="ts">

  import {computed, defineComponent, ref, unref} from "vue";
  import {BasicDrawer, useDrawerInner} from "/@/components/Drawer";
  import {BasicForm, useForm} from "/@/components/Form";

  export default defineComponent({
    name: 'RulerDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        // 动态生成对应的表单
        // schemas: menuCreateOrUpdateFormSchema,
        showActionButtonGroup: false,
        baseColProps: { lg: 12, md: 24 },
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        resetFields();
        setDrawerProps({ confirmLoading: false });
        isUpdate.value = !!data?.isUpdate;

        console.log(data.record)
        if (unref(isUpdate)) {
          setFieldsValue({
            ...data.record,
          });
        }
        const treeData = await listAllMenuApi();
        updateSchema({
          field: 'parentId',
          componentProps: { treeData },
        });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增菜单' : '编辑菜单'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          // 保存对应的节点属性
          // await createOrUpdateMenuApi(values);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      function


      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
