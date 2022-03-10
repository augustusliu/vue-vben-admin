<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModel"
    title="规则链基本信息"
    :canFullscreen=false
    @ok="handleSubmit">

    <div class="pt-3px pr-3px">
      <BasicForm @register="registerForm" />
    </div>
  </BasicModal>
</template>
<script lang="ts">

  import {defineComponent} from "vue";
  import {BasicModal, useModalInner} from "/@/components/Modal";
  import {BasicForm, useForm} from "/@/components/Form";
  import { ruleChainModelSchema } from "./rulechain.data";

  export default defineComponent({
    name: 'RuleChainBaseModel',
    components: { BasicModal, BasicForm, ruleChainModelSchema },
    emits: ['success'],
    setup(_, {emit}) {
      const [ registerForm, { setFieldsValue, validate }] = useForm({
        labelWidth: 120,
        schemas: ruleChainModelSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });

      // 打开model时处理传递进来的数据
      const [registerModel ] = useModalInner(async (data) => {
        if(data){
          await setFieldsValue({
            ruleChainName: data.ruleChainName,
            description: data.description
          })
        }
      });

      async function handleSubmit(){
        const values = await validate();
        emit('success', values);
      }

      return { registerModel, registerForm, handleSubmit };
    }


  });

</script>
