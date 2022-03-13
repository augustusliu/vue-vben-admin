<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    width="550px"
    showFooter
    @visible-change="drawerViewChange"
    @ok="handleSubmit">
    <div>
      <BasicForm @register="registerForm" ref="formEl">
      </BasicForm>
    </div>
  </BasicDrawer>
</template>

<script lang="ts">
  import {computed, defineComponent, nextTick, ref, unref} from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { CodeEditor } from "/@/components/CodeEditor";

  // 定义抽屉组件
  export default defineComponent({
    name: 'DynamicNodeDrawer',
    components: { BasicDrawer, BasicForm, CodeEditor },
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

      // 缓存当前页面展示的所有fields
      const currentFormFields: any = ref([]);

      // 动态title
      const getTitle = computed(() => (!unref(titleRef) ? '配置信息' : titleRef.value));

      // 如果是更新，则设置对应的属性值
      const [ registerDrawer ] = useDrawerInner(async (data) => {
        await nextTick();
        const { title, config, values } = data;
        // 设置title
        titleRef.value = title;

        // 动态设置表单内容
        const schemasData: FormSchema[] = [];
        config.forEach(item => {
          schemasData.push(item);
          currentFormFields.value.push(item.field);
        })
        // 重置属性
        await formAction.setProps({schemas: schemasData})

        // 获取当前form值，如果不为空，则更新
        if(values){
          await formAction.setFieldsValue(values);
        }
      })

      async function handleSubmit() {
        const values = await formAction.validate();
        // 清空schema
        await formAction.removeSchemaByFiled(currentFormFields.value);
        currentFormFields.value = [];
        // 采用emit 将值传递给父组件
        emit('success', values);
      }

      async function drawerViewChange(show: boolean){
        if(!show){
          // 清空schema
          await formAction.removeSchemaByFiled(currentFormFields.value);
          currentFormFields.value = [];
        }
      }

      return { getTitle, registerForm, registerDrawer, drawerViewChange, handleSubmit};
    },
  });
</script>
