<template>
  <PageWrapper>
    <canvas ref="assetModelContainerRef"></canvas>
  </PageWrapper>
</template>

<script lang="ts">
  import {defineComponent, ref} from "vue";
  import {PageWrapper} from '/@/components/Page';
  import {useRoute} from "vue-router";

  // 模型资产绑定设备组件
  export default defineComponent({
    name: 'AssetModelComponent',
    components: { PageWrapper },
    setup(){
      const route = useRoute();
      const assetId = ref(route.params?.id).value as string;


    }
  })
</script>

<style lang="less">

</style>
