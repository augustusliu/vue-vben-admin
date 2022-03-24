<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    minHeight="50px"
    width="300px"
    title="设备秘钥"
    :canFullscreen=false
    :showCancelBtn=false
    :okButtonProps="{
      onClick:handleCopy,
    }"
    okText="复制设备秘钥">
    <a-button type="dashed" class="ml-2" disabled style="cursor: auto"> 设备秘钥: {{credentials}} </a-button>
  </BasicModal>
</template>

<script lang="ts">
  import { defineComponent, ref} from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { getCredentialsApi } from '/@/api/things/device/deviceApi';
  import { useCopyToClipboard } from '/@/hooks/web/useCopyToClipboard';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    components: { BasicModal },
    props: {deviceIdData:{type: Object}},
    setup() {
      const isLoaded = ref(false);
      const credentials = ref();
      const { createMessage } = useMessage();
      const { clipboardRef } = useCopyToClipboard();
      const [register, { closeModal }] = useModalInner((data) => {
        data && onDataReceive(data);
      });

      function onDataReceive(data){
        getDeviceCredentials(data.deviceId);
      }

      async function getDeviceCredentials(deviceId){
        const res = await getCredentialsApi(deviceId)
        if(!res){
          return;
        }
        credentials.value = res.credentialsToken;
        isLoaded.value = true;
      }

      function handleCopy() {
        if (!credentials.value) {
          createMessage.warning('未找到要拷贝的内容！');
          return;
        }
        clipboardRef.value = credentials.value;
        createMessage.warning('复制成功！');
        closeModal();
      }
      return {
        handleCopy,
        register,
        isLoaded,
        credentials,
      };
    },
  });

</script>

<style scoped>
  .empty-tips {
    height: 100px;
    line-height: 100px;
    text-align: center;
  }
</style>
