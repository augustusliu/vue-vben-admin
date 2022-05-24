<template>
  <PageWrapper class="h-full w-full">
  <!--资产统一监控看板-->
      <div class="lg:flex md:flex" style="min-height: 340px;margin-top: 10px;">
        <!--  分两个tab,一个是含3d模型的tab,一个是不含3d模型的tab  -->
        <div class="lg:w-7/10 w-full !mr-4 enter-y">
          <AssetRealtimeLine :entityId="assetId" class="enter-y"/>
        </div>
        <div class="lg:w-3/10 w-full !mr-4 enter-y">
          <AssetAlarmHistogramMetric :entityId="assetId" entityType="ASSET" class="enter-y"/>
        </div>
      </div>
    </PageWrapper>
</template>
<script lang="ts">
  import {defineComponent, ref} from "vue";
  import AssetRealtimeLine from "/@/views/things/asset/monitor/rt/AssetRealtimeLine.vue";
  import AssetAlarmHistogramMetric from "/@/views/things/asset/monitor/rt/AssetAlarmHistogramMetric.vue";
  import {useRoute} from "vue-router";
  import {PageWrapper} from "/@/components/Page";

  export default defineComponent({
    name: 'AssetRealtime',
    components: {AssetRealtimeLine, AssetAlarmHistogramMetric, PageWrapper},
    setup(){
      const route = useRoute();
      // 此处可以得到用户ID
      const assetId = ref(route.params?.id).value as string;
      return {assetId}
    }
  });
</script>
<style lang="less">
  .vben-page-wrapper, .vben-page-wrapper-content{
    padding: 0px 0px!important;
    margin: 0px 0px!important;
  }
  .assetMonitorContainer{
    width: 100%;
    height: 100%;
  }

</style>
