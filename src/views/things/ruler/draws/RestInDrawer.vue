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

  // 请求API配置信息
  const schemas: FormSchema[] = [
    {
      field: 'endpoint',
      component: 'Input',
      label: '连接地址',
      colProps: {
        span: 12,
      },
    },
    {
      field: 'method',
      component: 'Select',
      label: '请求方式',
      colProps: {
        span: 12,
      },
      defaultValue: 'GET',
      componentProps: {
        options: [
          { label: 'GET', value: 'GET' },
          { label: 'POST', value: 'POST' },
          { label: 'PUT', value: 'PUT' },
          { label: 'DELETE', value: 'DELETE' },
          { label: 'HEAD', value: 'HEAD' },
          { label: 'PATCH', value: 'PATCH' },
          { label: 'OPTIONS', value: 'OPTIONS' },
          { label: 'TRACE', value: 'TRACE' },
        ],
      },
      required: true,
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
      field: 'payload',
      component: 'InputTextArea',
      label: '参数',
      colProps: {
        span: 12,
      },
      defaultValue: '',
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
