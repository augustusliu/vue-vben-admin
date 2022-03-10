<template>
  <PageWrapper v-if="isLoaded">
    <Description @register="registerDeviceDetailInfo"
                 :collapseOptions="{ canExpand: true }"
                 class="mt-4" />
    <div :class="`${prefixCls}-bottom`">
      <Tabs>
        <template v-for="item in tabListScheme" :key="item.key">
          <TabPane :tab="item.name">
            <!-- 动态组件切换-->
            <component :is="item.component" :entityId="entityId" :entityType="entityType"/>
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
  import { Tag, Tabs } from 'ant-design-vue';
  import { Description, useDescription } from '/@/components/Description/index';
  import { ScrollContainer } from "/@/components/Container";
  import { getDeviceApi } from '/@/api/things/device/deviceApi';
  import { deviceDetailInfoScheme } from './device.data'
  import { tabListScheme } from '../common/entityTabs/tab.data'
  import EntityAttributes from '../common/entityTabs/EntityAttributes.vue'
  import EntityTelemetry from '../common/entityTabs/EntityTelemetry.vue'
  import EntityEvent from '../common/entityTabs/EntityEvent.vue'
  import EntityAlarm from '../common/entityTabs/EntityAlarm.vue'
  import EntityRelation from '../common/relation/index.vue';

  // tab信息参考/page/account/setting配置
  export default defineComponent({
    name: 'DeviceDetail',
    components: { Description,
      PageWrapper,
      Tag,
      Tabs,
      TabPane: Tabs.TabPane,
      ScrollContainer, EntityAttributes, EntityTelemetry, EntityEvent, EntityAlarm, EntityRelation },
    setup() {
      const route = useRoute();
      // 此处可以得到用户ID
      const entityId = ref(route.params?.id).value as string;
      const entityType = "DEVICE";
      // 如果是设备，则不显示设备关系图。(设备关系图应该显示设备与资产的关系)
      // const deviceTabList = tabListScheme.slice(1,5);
      const deviceInfo: any = ref({})
      // 页面是否加载成功
      const isLoaded = ref(false)
      // 默认显示的当前tab
      const currentKey = ref('attrs');

      // 获取资产详情信息
      async function initDeviceInfo(){
        const res = await getDeviceApi(entityId);
        if(!res){
          return;
        }
        deviceInfo.value = res
        isLoaded.value = true;
      }

      // 显示资产详情信息
      const [registerDeviceDetailInfo] = useDescription({
        title: '设备信息',
        bordered: false,
        data: deviceInfo,
        schema: deviceDetailInfoScheme,
      });
      onMounted(initDeviceInfo);
      return {
        prefixCls: 'common-tab-setting',
        entityId,
        entityType,
        currentKey,
        registerDeviceDetailInfo,
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
  .common-tab-setting {
    &-bottom {
      margin-top: 12px;
      padding: 6px 6px;
      background-color: @component-background;
      border-radius: 3px;
    }
  }
</style>
