<template>
  <PageWrapper :title="`资产` + assetId" @back="goBack"
    content="这是用户资料详情页面。本页面仅用于演示相同路由在tab中打开多个页面并且显示不同的数据"
    contentBackground >
    <template #footer>
      <a-tabs default-active-key="detail" v-model:activeKey="currentKey">
        <a-tab-pane key="relation" tab="关系图" />
        <a-tab-pane key="attrs" tab="资产属性" />
        <a-tab-pane key="telemetry" tab="最新遥测" />
        <a-tab-pane key="event" tab="事件" />
        <a-tab-pane key="alarm" tab="警告" />
      </a-tabs>
    </template>

    <div class="pt-4 m-4 desc-wrap">
      <template v-if="currentKey == 'attrs'">
        <div v-for="i in 10" :key="i">这是用户{{ userId }} 资料属性</div>
      </template>
      <template v-if="currentKey == 'telemetry'">
        <div v-for="i in 10" :key="i">这是用户{{ userId }} 最新遥测</div>
      </template>
      <template v-if="currentKey == 'event'">
        <div v-for="i in 10" :key="i">这是用户{{ userId }} 事件</div>
      </template>
      <template v-if="currentKey == 'alarm'">
        <div v-for="i in 10" :key="i">这是用户{{ userId }} 警告</div>
      </template>
      <template v-if="currentKey == 'relation'">
        <div v-for="i in 10" :key="i">这是用户{{ userId }} 关系图</div>
      </template>
    </div>
  </PageWrapper>
</template>

<script>
  import { defineComponent, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { useGo } from '/@/hooks/web/usePage';
  import { useTabs } from '/@/hooks/web/useTabs';
  import { Tabs } from 'ant-design-vue';

  export default defineComponent({
    name: 'AssetDetail',
    components: { PageWrapper, ATabs: Tabs, ATabPane: Tabs.TabPane },
    setup() {
      const route = useRoute();
      const go = useGo();
      // 此处可以得到用户ID
      const assetId = ref(route.params?.id);
      // 默认显示的当前tab
      const currentKey = ref('attrs');
      const { setTitle } = useTabs();
      // TODO
      // 本页代码仅作演示，实际应当通过userId从接口获得用户的相关资料

      // 设置Tab的标题(可以加上资产明湖曾)
      setTitle('资产详情');

      // 页面左侧点击返回链接时的操作
      function goBack() {
        // 本例的效果时点击返回始终跳转到账号列表页，实际应用时可返回上一页
        go('/asset');
      }
      return { assetId, currentKey, goBack };
    },
  });
</script>
