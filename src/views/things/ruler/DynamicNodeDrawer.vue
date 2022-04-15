<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    @visible-change="drawerViewChange"
    :title="getTitle"
    width="550px"
    showFooter
    @ok="handleSubmit">
    <div>
      <BasicForm @register="registerForm" ref="formEl">
        <template #autoControlList="{ model, field }">
          <CommandDownConditionSlot
            v-model:value="model[field]"
            :entityId="autoControlEntityId"
            :entityType="autoControlMethod"/>
        </template>
      </BasicForm>
    </div>
  </BasicDrawer>
</template>

<script lang="ts">
  import {computed, defineComponent, ref, unref} from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { CodeEditor } from "/@/components/CodeEditor";
  import { nodeFormSchema, autoControlMethod, autoControlEntityId } from './ruleNodeColumnsDefinition';
  import CommandDownConditionSlot from './CommandDownConditionSlot.vue';
  // 定义抽屉组件
  export default defineComponent({
    name: 'DynamicNodeDrawer',
    components: { BasicDrawer, BasicForm, CodeEditor, CommandDownConditionSlot },
    emit: ['success', 'register'], // 父组件中采用@success接收参数
    setup(_,{ emit }) {
      const titleRef: any = ref(null);
      const [ registerForm , formAction ] = useForm({
        layout: 'vertical',
        schemas: [],  // 初始化时为空，基于上个页面动态传入
        showActionButtonGroup: false,
        showResetButton: true,
        showSubmitButton: true,
      });

      // 动态title
      const getTitle = computed(() => (!unref(titleRef) ? '配置信息' : titleRef.value));

      // 如果是更新，则设置对应的属性值
      const [ registerDrawer, {setDrawerProps} ] = useDrawerInner(async (data) => {
        setDrawerProps({ loading: true });
        await formAction.resetFields();
        const { nodeFixId, title, values } = data;
        // 1、设置title
        titleRef.value = title;

        const nodeFormScheme = findNodeFormScheme(nodeFixId);
        // 2、设置form表单的属性--设置完表单后再重置
        await formAction.setProps({schemas: nodeFormScheme})
        // 3、获取当前form值，如果不为空，则更新
        if(values){
          await formAction.setFieldsValue(values);
        }
        setDrawerProps({ confirmLoading: false, loading: false });
      })

      async function handleSubmit() {
        const values = await formAction.validate();
        // 清空schema
        await formAction.setProps({schemas: []})
        console.log('form', values);
        // 采用emit 将值传递给父组件
        emit('success', values);
      }

      async function drawerViewChange(show: boolean){
        if(!show){
          // 清空schema
          await formAction.setProps({schemas: []})
        }
      }

      // 从模板中获取当前节点对应的表单项
      function findNodeFormScheme(nodeId: string): FormSchema[]{
        const schemes =  nodeFormSchema.find(item => Number(item.ruleNodeFixId) === Number(nodeId));
        if(!schemes){
          return [];
        }else{
          return schemes.schemas;
        }
      }

      return { getTitle, registerForm, registerDrawer, drawerViewChange, handleSubmit, autoControlMethod, autoControlEntityId};
    },
  });
</script>
