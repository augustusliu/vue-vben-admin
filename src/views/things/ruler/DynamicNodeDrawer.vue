<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="getTitle"
    width="550px"
    showFooter
    @ok="handleSubmit">
    <div>
      <BasicForm @register="registerForm" ref="formEl">
      <!--  创建动态表单 ，field = 0 的属性 -->
        <template #add="{ field }">
          <Button v-if="Number(field) === 0" @click="addField">+</Button>
          <Button v-if="field > 0" @click="delField(field)">-</Button>
        </template>
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
        baseColProps: {
          span: 6,
        },
        schemas: [],  // 初始化时为空，基于上个页面动态传入
        showActionButtonGroup: false,
        showResetButton: true,
        showSubmitButton: true,
      });

      // 缓存当前页面展示的所有fields
      const currentFormFields: any = ref([]);
      // 默认待添加的第n个field
      const fieldCount = ref(1);

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

        // 如果存在动态添加表单
        if(Reflect.has(values, 'headerKey0')){
          const headers: any = {};
          // 将动态表单中添加的输入内容变成统一
          for(let i = 0; i < fieldCount.value; i++){
            let headerKey = `headerKey${i}`;
            let headerValue = `headerValue${i}`;
            Reflect.set(headers, Reflect.get(values, headerKey), Reflect.get(values, headerValue));
          }
          values.headers = headers;
        }

        // 清空schema
        await formAction.removeSchemaByFiled(currentFormFields.value);
        currentFormFields.value = [];
        // 采用emit 将值传递给父组件
        emit('success', values);
      }

      function addField(){
        formAction.appendSchemaByField({
            field: `headerKey${fieldCount.value}`,
            component: 'Input',
            label: '',
            colProps: {
              span: 10,
            },
            required: true,
          },
          `0`
        );

        formAction.appendSchemaByField(
          {
            field: `headerValue${fieldCount.value}`,
            component: 'Input',
            label: '',
            colProps: {
              span: 10,
            },
            required: true,
          },
          `headerKey${fieldCount.value}`
        );
        formAction.appendSchemaByField({
            field: `${fieldCount.value}`,
            component: 'Input',
            label: '',
            colProps: {
              span: 2,
            },
            slot: 'add',
          },
          `headerValue${fieldCount.value}`
        );
        fieldCount.value++
      }

      function delField(field) {
        formAction.removeSchemaByFiled([`headerKey${field}`, `headerValue${field}`, `${field}`]);
        fieldCount.value--;
      }


      return { getTitle, registerForm, registerDrawer, handleSubmit, addField, delField };
    },
  });
</script>
