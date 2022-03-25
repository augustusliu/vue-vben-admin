<template>
  <PageWrapper style="height: 100%;">
    <div class="h-full" :class="`${prefixCls}-bottom`">
      <Tabs>
        <template v-for="item in templateTabListScheme" :key="item.key">
          <TabPane :tab="item.name" class="h-full">
            <!-- 动态组件切换-->
            <component :is="item.component" :entityId="entityId" :entityType="entityType" class="h-full"/>
          </TabPane>
        </template>
      </Tabs>
    </div>
  </PageWrapper>

</template>

<script lang="ts">
  import { defineComponent, ref} from 'vue';
  import { useRoute } from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { Tag, Tabs } from 'ant-design-vue';
  import { ScrollContainer } from "/@/components/Container";
  import { templateTabListScheme } from './template.data';
  import EntityAttributes from '../../common/entityTabs/EntityAttributes.vue'
  import EntityCommand from "../../common/entityTabs/EntityCommand.vue";
  import {EntityTypeEnum} from "/@/enums/entityEnum";


  export default defineComponent({
    name: 'DeviceTemplateDetail',
    components: { PageWrapper,
      Tag,
      Tabs,
      TabPane: Tabs.TabPane,
      ScrollContainer, EntityAttributes, EntityCommand },
    setup() {
      const route = useRoute();
      const entityId = ref(route.params?.id).value as string;
      const entityType = EntityTypeEnum.DEVICE_TEMPLATE;

      // 默认显示的当前tab
      const currentKey = ref('attrs');

      return {
        prefixCls: 'common-tab-setting',
        templateTabListScheme,
        entityId,
        entityType,
        currentKey,
        // tabBarStyle: {
        //   width: '220px',
        // },
      }
    }
  });
</script>

<style lang="less">
  .common-tab-setting {
    &-bottom {
      background-color: @component-background;
      border-radius: 3px;
      height: 100%;
    }
  }
  .vben-page-wrapper{
    height: 100%;
  }
  .vben-page-wrapper-content{
    height: 100%;
  }
</style>
