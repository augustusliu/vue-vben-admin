<template>
  <BasicDrawer v-bind="$attrs" @register="register" title="Drawer Title" width="50%">
    <div>
      <BasicForm @register="registerForm" />
    </div>
  </BasicDrawer>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';

  // 配置kafka生产者配置信息
  const schemas: FormSchema[] = [
    {
      field: 'bootstrapServers',
      component: 'Input',
      label: '连接地址',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'topic',
      component: 'Input',
      label: '主题',
      colProps: {
        span: 12,
      },
      defaultValue: '',
    },
    {
      field: 'clientId',
      component: 'Input',
      label: '客户端id',
      colProps: {
        span: 12,
      },
      defaultValue: '',
    },
    {
      field: 'retries',
      component: 'Input',
      label: '重试次数',
      colProps: {
        span: 12,
      },
      defaultValue: '1',
    },
    {
      field: 'needHeader',
      component: 'RadioButtonGroup',
      label: '重试次数',
      colProps: {
        span: 12,
      },
      defaultValue: false,
      componentProps: {
        options: [
          { label: '携带', value: true },
          { label: '不携带', value: false },
        ],
      },
    },
  ];

  // 定义抽屉组件
  export default defineComponent({
    components: { BasicDrawer, BasicForm },
    setup() {
      const [registerForm, { setFieldsValue }] = useForm({
        labelWidth: 120,
        schemas,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });

      // 如果是更新，则设置对应的属性值
      const [register] = useDrawerInner((data) => {
        // 方式1
        setFieldsValue({
          bootstrapServers: data.bootstrapServers,
          topic: data.topic,
          clientId: data.clientId,
          retries: data.retries,
          needHeader: data.needHeader,
        });
      });
      return { register, schemas, registerForm };
    },
  });
</script>
