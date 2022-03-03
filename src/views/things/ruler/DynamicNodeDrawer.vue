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
    setup() {
      const titleRef: any = ref(null);
      const [ registerForm , formAction ] = useForm({
        labelWidth: 90,
        schemas: [],  // 初始化时为空，基于上个页面动态传入
        showActionButtonGroup: false,
        showResetButton: true,
        showSubmitButton: true,
      });

      const getTitle = computed(() => (!unref(titleRef) ? '配置信息' : titleRef.value));

      // 如果是更新，则设置对应的属性值
      const [ registerDrawer ] = useDrawerInner(async (data) => {

        // 设置title
        titleRef.value = data.title;

        // 动态设置表单内容
        const schemasData: FormSchema[] = [];
        data.settings.forEach(item => {
          schemasData.push(item);
        })
        // 更新form 表单
        await formAction.setProps({schemas: schemasData})
      })

      async function handleSubmit() {}

      return { getTitle, registerForm, registerDrawer, handleSubmit };
    },
  });
</script>
