<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    @visible-change="drawerViewChange"
    :title="titleRef"
    width="550px"
    :showOkBtn="false"
    cancelText="关闭"
    showFooter>
    <div>
      <List itemLayout="horizontal" >
        <template v-for="item in debugList" >
          <List.Item>
            <List.Item.Meta
                :title ="item.nodeName"
                :description="item.payload"
            />
          </List.Item>
        </template>
      </List>
    </div>
  </BasicDrawer>
</template>

<script lang="ts">

  import {defineComponent, reactive, Ref, ref} from "vue";
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import {List } from 'ant-design-vue';
  import { useWebSocket } from '@vueuse/core';
  import { getRuleDebugInfoWsApi } from '/@/api/things/ruler/ruleApi';

  export default defineComponent({
    name: 'RuleDebugInfoDrawer',
    components: { BasicDrawer ,List },
    props: ['ruleChainId'],
    setup(props){
      const titleRef: any = ref('调试信息');
      const debugList = ref([]) as Ref<[]>
      const wsUrl = getRuleDebugInfoWsApi(props.ruleChainId);
      console.log(props.ruleChainId)
      // 定义一个ws的对象，保存ws的连接地址
      const wsState = reactive({
        server: wsUrl,
        sendValue: '',
        recordList: [] as { id: number; time: number; res: string }[],
      });

      // 注册ws对象
      const { status, data, send, close, open } = useWebSocket(wsState.server, {
        autoReconnect: false,
        heartbeat: true,
        immediate: false,
        autoClose: false,
      });

      const [ registerDrawer] = useDrawerInner(async (data) => {
          const { ruleChainName } = data;
          titleRef.value = ruleChainName + '(调试信息)';
          console.log('ws', wsState.server)
          open();
      });

      return { registerDrawer, titleRef, debugList }
    }
  });
</script>
