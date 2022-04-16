<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    showFooter
    title="选择下发的指令"
    width="500px"
    @ok="handleSubmit"
  >
    <BasicForm @register="registerForm">
      <template #menu="{ model, field }"></template>
      <template #issueCommandListSlot="{ model, field }">
        <CommandDownConditionSlot
          v-model:value="model[field]"
          :entityId="adjustEntityId"
          :entityType="adjustEntityType"/>
      </template>
    </BasicForm>
  </BasicDrawer>
</template>

<script lang="ts">
  import { defineComponent, ref, unref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import CommandDownConditionSlot from '../../ruler/CommandDownConditionSlot.vue';
  import { addCommandIssueFormItem } from './issue.data'
  import {useMessage} from "/@/hooks/web/useMessage";
  import {
    DeviceIssueCreateParam,
  } from "/@/api/things/device/model/deviceModel";
  import {IssueOrAttrType} from "/@/enums/IssueOrAttrTypeEnum";
  import {batchAddIssueApi} from "/@/api/things/device/deviceApi";

  export default defineComponent({
    name: 'CommandIssueDrawer',
    components: { BasicDrawer, BasicForm, CommandDownConditionSlot },
    props:["entityId", "entityType"],
    emits: ['success', 'register'],
    setup(props, { emit }) {
      const isUpdate = ref(true);
      const adjustEntityId = ref<number|undefined>();
      const adjustEntityType = ref<string| undefined>();
      const { createMessage } = useMessage();
      adjustEntityId.value = props.entityId;
      adjustEntityType.value = props.entityType;

      const issueAttributes = ref<DeviceIssueCreateParam[]>([]);
      const [registerForm, { resetFields, setFieldsValue, validate }] = useForm({
        layout: 'vertical',
        labelWidth: 120,
        schemas: addCommandIssueFormItem,
        showActionButtonGroup: false,
      });

      const [registerDrawer, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
        setDrawerProps({ confirmLoading: false, loading: true });
        await resetFields();
        isUpdate.value = !!data?.isUpdate;

        if (unref(isUpdate)) {
          await setFieldsValue({
            ...data.record,
          });
        }
        setDrawerProps({ confirmLoading: false, loading: false });
      });

      async function handleSubmit() {
        try {
          unref(issueAttributes).splice(0, unref(issueAttributes).length) ;
          const values = await validate();
          console.log(values);
          if(!values.issueCommandList || values.issueCommandList.lenght <=0){
            createMessage.error('下发的指令不能为空');
            return;
          }
          values.issueCommandList.forEach(record => {
            unref(issueAttributes).push({
              entityId: props.entityId,
              entityType: props.entityType,
              code: record.code,
              value: record.distributeValue,
              issueType: IssueOrAttrType.COMMAND,
              remark: values.remark,
              issueSrc: 'CREATED',
              keyName: record.name,
            });
          })
          await batchAddIssueApi(unref(issueAttributes));
          closeDrawer();
          emit('success');
        } finally {
          setDrawerProps({ confirmLoading: false });
        }
      }

      return {
        adjustEntityId,
        adjustEntityType,
        registerDrawer,
        registerForm,
        handleSubmit,
      };
    },
  });
</script>
