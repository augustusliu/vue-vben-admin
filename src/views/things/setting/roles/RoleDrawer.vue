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
      <template #roleMenu="{ model, field }">
        <BasicTree
          v-model:value="model[field]"
          :treeData="menuData"
          :replaceFields="{ title: 'nameSearch', key: 'id' }"
          checkable
          toolbar
          title="菜单分配"
        />
      </template>
    </BasicForm>
  </BasicDrawer>
</template>
<script lang="ts">
  import { defineComponent, ref, computed, unref } from 'vue';
  import { BasicTree } from '/@/components/Tree';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { createOrUpdateAuthorityFormSchema } from './roles.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';

  import { addOrUpdateAuthority, listMenusByAuthority } from '/@/api/things/roles/roleApi';
  import { listAllMenuApi } from '/@/api/things/menu/menuApi';

  export default defineComponent({
    name: 'RoleDrawer',
    components: { BasicDrawer, BasicForm , BasicTree },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);
      const menuData = ref<any>();
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        labelWidth: 90,
        schemas: createOrUpdateAuthorityFormSchema,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ loading: true });
        await resetFields();
        isUpdate.value = !!data?.isUpdate;

        menuData.value = await listAllMenuApi();
        if (unref(isUpdate)) {

          // 查询当前角色的所有菜单
          const selectMenus = await listMenusByAuthority(data.record.id);
          if(selectMenus){
            data.record.menus = selectMenus;
          }
          await setFieldsValue({
            ...data.record,
          });
        }
        setDrawerProps({ confirmLoading: false, loading: false });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增角色' : '编辑角色'));

      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          await addOrUpdateAuthority(values);
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
        menuData,
      };
    },
  });
</script>
