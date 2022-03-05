<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    width="550px"
    showFooter
    @ok="handleSubmit">
    <div>
      <BasicForm @register="registerForm" ref="formEl"/>
    </div>
  </BasicDrawer>
</template>

<script lang="ts">
  import {computed, defineComponent, ref, unref} from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';

  // 定义抽屉组件
  export default defineComponent({
    name: 'DynamicNodeDrawer',
    components: { BasicDrawer, BasicForm },
    emit: ['success', 'register'], // 父组件中采用@success接收参数
    setup(_,{ emit }) {
      const titleRef: any = ref(null);
      const [ registerForm , formAction ] = useForm({
        labelWidth: 90,
        schemas: [],  // 初始化时为空，基于上个页面动态传入
        showActionButtonGroup: false,
        showResetButton: true,
        showSubmitButton: true,
      });

      // 动态title
      const getTitle = computed(() => (!unref(titleRef) ? '配置信息' : titleRef.value));

      // 如果是更新，则设置对应的属性值
      const [ registerDrawer, { closeDrawer } ] = useDrawerInner(async (data) => {

        const { title, config, values } = data;
        // 设置title
        titleRef.value = title;

        // 动态设置表单内容
        const schemasData: FormSchema[] = [];
        config.forEach(item => {
          schemasData.push(item);
        })
        // 更新form 表单
        await formAction.setProps({schemas: schemasData})

        // 获取当前form值，如果不为空，则更新
        if(values){
          await formAction.setFieldsValue(values);
        }
      })

      async function handleSubmit() {
        const values = await formAction.validate();
        // 采用emit 将值传递给父组件
        closeDrawer();
        await formAction.resetFields();
        emit('success', values);
      }

      return { getTitle, registerForm, registerDrawer, handleSubmit };
    },
  });
</script>
