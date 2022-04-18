<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="registerModel"
    title="处理报警"
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
  import { alarmDealFormSchema } from "./alarm.data";
  import {dealAlarmApi} from "/@/api/things/alarm/alarmApi";

  export default defineComponent({
    name: 'AlarmDealModel',
    components: { BasicModal, BasicForm },
    emits: ['success'],
    setup(_, {emit}) {
      const [ registerForm, { setFieldsValue, validate }] = useForm({
        labelWidth: 80,
        schemas: alarmDealFormSchema,
        showActionButtonGroup: false,
        actionColOptions: {
          span: 24,
        },
      });

      // 打开model时处理传递进来的数据
      const [registerModel] = useModalInner(async (data) => {
        if(data){
          await setFieldsValue({
            id: data.id,
            alarmName: data.alarmName
          })
        }
      });

      async function handleSubmit(){
        const values = await validate();
        await dealAlarmApi({
          id: values.id,
          remark: values.remark,
          status: values.alarmStatus,

        });
        emit('success', values);
      }
      return { registerModel, registerForm, handleSubmit };
    }

  });

</script>
