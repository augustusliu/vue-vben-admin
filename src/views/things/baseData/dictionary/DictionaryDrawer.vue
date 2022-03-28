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
  import { dictionaryCreateOrUpdateFormSchema } from './dictionary.data';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { dictionaryAddOrUpdate, listDictionaryAll } from '/@/api/things/dictionary/dictionaryApi';

  export default defineComponent({
    name: 'DictionaryDrawer',
    components: { BasicDrawer, BasicForm },
    emits: ['success', 'register'],
    setup(_, { emit }) {
      const isUpdate = ref(true);

      const [registerForm, { resetFields, setFieldsValue, updateSchema, validate }] = useForm({
        labelWidth: 100,
        schemas: dictionaryCreateOrUpdateFormSchema,
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
        // 加载初始节点(这里是懒加载，但是懒加载会导致编辑时的回显问题，所以这里应该是需要全量加载)
        // let treeData = await listDictionaryByParentId(0);
        let treeData = await listDictionaryAll(0);
        // 动态设置某个字段的值
        await updateSchema({
          field: 'parentId',
          componentProps: {
            treeDataSimpleMode: true,
            treeData: preProcessData(treeData),
            dropdownStyle: { maxHeight: 270, overflow: 'auto' },
            // // 异步加载子节点
            // loadData: loadChildData,
          },
        });
        setDrawerProps({ confirmLoading: false,loading: false });
      });

      const getTitle = computed(() => (!unref(isUpdate) ? '新增字典' : '编辑字典'));
      async function handleSubmit() {
        try {
          const values = await validate();
          setDrawerProps({ confirmLoading: true });
          await dictionaryAddOrUpdate(values);
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      // 异步基于节点加载子节点，懒加载子节点数据
      // const loadChildData = (node) => listDictionaryByParentId(node.dataRef.id).then((child) => {
      //   node.dataRef.children = preProcessData(child);
      // });

      function preProcessData(nodes) {
        nodes.forEach((item) => {
          item['isLeaf'] = !item.hasChild;
        });
        return nodes;
      }

      return { registerDrawer, registerForm, getTitle, handleSubmit };
    },
  });
</script>
