<template>

  <PageWrapper v-if="isLoaded">
    <Description @register="registerAssetInfo" class="mt-4" />

    <div :class="`${prefixCls}-bottom`">
      <Tabs>
        <template v-for="item in tabListScheme" :key="item.key">
          <TabPane :tab="item.name">
<!--            动态组件切换-->
            <component :is="item.component" :entityId="assetId" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </PageWrapper>

</template>

<script lang="ts">
  import { defineComponent, onMounted, ref} from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { Tag, Tabs } from 'ant-design-vue';
  import { Description, useDescription } from '/@/components/Description/index';
  import {ScrollContainer} from "/@/components/Container";

  import { getAssetApi } from '/@/api/things/asset/assetApi';
  import { assetInfoScheme } from './asset.data'

  import { tabListScheme } from './tabs/tab.data'
  import EntityAttributes from './tabs/EntityAttributes.vue'
  import EntityTelemetry from './tabs/EntityTelemetry.vue'
  import EntityEvent from './tabs/EntityEvent.vue'
  import EntityAlarm from './tabs/EntityAlarm.vue'

  // tab信息参考/page/account/setting配置
  export default defineComponent({
    name: 'AssetDetail',
    components: { Description,
      PageWrapper,
      Tag,
      Tabs,
      TabPane: Tabs.TabPane,
      ScrollContainer, EntityAttributes, EntityTelemetry, EntityEvent, EntityAlarm },
    setup() {
      const route = useRoute();
      const go = useGo();
      // 此处可以得到用户ID
      const assetId = ref(route.params?.id).value;
      const assetInfo: any = ref({})
      // 页面是否加载成功
      const isLoaded = ref(false)
      // 默认显示的当前tab
      const currentKey = ref('attrs');

      // 获取资产详情信息
      async function initAssetInfo(){
        const res = await getAssetApi(assetId);
        if(!res){
          return;
        }
        assetInfo.value = res
        isLoaded.value = true;
      }

      // 页面左侧点击返回链接时的操作
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/asset');
      }

      // 显示资产详情信息
      const [registerAssetInfo] = useDescription({
        title: '资产信息',
        bordered: false,
        data: assetInfo,
        schema: assetInfoScheme,
      });

      onMounted(initAssetInfo);
      return {
        prefixCls: 'asset-tab-setting',
        assetId,
        currentKey,
        goBack,
        registerAssetInfo,
        isLoaded,
        tabListScheme,
        tabBarStyle: {
          width: '220px',
        },
      };
    },
  });
</script>

<style lang="less">
  .asset-tab-setting {
    &-bottom {
      margin-top: 12px;
      padding: 6px 6px;
      background-color: @component-background;
      border-radius: 3px;
    }
  }
</style>
