<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    @visible-change="drawerViewChange"
    @close="closeDrawer"
    :title="titleRef"
    :showOkBtn="false"
    width="650px"
    cancelText="关闭调试"
    showFooter>
    <div>
      <Row style="margin-bottom: 15px">
        <Col span="6"><Badge status="processing" text="调试中" /> </Col>
        <Col span="6" offset="12">
          <a class="debugDeleteClass" :onclick="deleteDebugList"> <Icon icon="ant-design:delete-outlined"/> 清除</a>
        </Col>
      </Row>
      <Collapse ghost="true"
                expandIconPosition="right">
        <CollapsePanel :key="item.nodeId + item.ts"  :header="getDebugTitle(item.nodeName, item.ts)" v-for="item in wsState.receiveRecord">
          {{item.message}}
        </CollapsePanel>
      </Collapse>
    </div>
  </BasicDrawer>
</template>

<script lang="ts">

  import {defineComponent, ref, unref, watchEffect} from "vue";
  import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
  import {List, ListItem, ListItemMeta, Collapse, CollapsePanel, Row, Col, Spin, Badge} from 'ant-design-vue';
  import {Icon} from '/@/components/Icon/index';
  import { useWebSocket } from '@vueuse/core';
  import moment from "moment";
  import { getRuleDebugInfoWsApi } from '/@/api/things/ruler/ruleApi';

  export default defineComponent({
    name: 'RuleDebugInfoDrawer',
    components: { BasicDrawer ,List, ListItem, ListItemMeta, Collapse, CollapsePanel, Row, Col ,Spin, Icon, Badge},
    props: {
      ruleChainId: {
        type: Number as PropType<number | undefined>,
      }
    },
    setup(props){
      const titleRef: any = ref('调试信息');
      const ruleId:any = props.ruleChainId;
      const wsUrl = getRuleDebugInfoWsApi(ruleId);
      // 定义一个ws的对象，保存ws的连接地址
      const wsState = ref({
        server: wsUrl,
        sendValue: '',
        receiveRecord: [] as { nodeId: number; nodeName: string; message: string }[],
      });

      // 注册ws对象
      const {data, close, open } = useWebSocket(unref(wsState).server, {
        autoReconnect: false,
        heartbeat: true,
        immediate: false,
        autoClose: false,
      });

      const [ registerDrawer] = useDrawerInner(async (data) => {
          const { ruleChainName } = data;
          titleRef.value = ruleChainName + '(调试信息)';
          open();
      });

      watchEffect(() => {
        if (data.value) {
          try {
            const res = JSON.parse(data.value);
            unref(wsState).receiveRecord.unshift({
              nodeId: res.nodeId,
              nodeName: res.nodeName,
              message: JSON.stringify(res),
            });
          } catch (error) {
            console.log('ws parse error', error)
          }
        }
      });

      function drawerViewChange(drawOpened: boolean){
        if(!drawOpened){
           close();
        }
      }

      function closeDrawer(){
        close();
      }
      const deleteDebugList = () => {
         let len = unref(wsState).receiveRecord.length;
         while(len >0){
           unref(wsState).receiveRecord.pop();
           len--;
         }
      }
      const getDebugTitle = (title: string, ts: number) => {
        return "["+ title +"]     " + moment(ts).format('YYYY-MM-DD HH:mm:ss');
      }
      return { registerDrawer, titleRef, wsState, drawerViewChange, closeDrawer, deleteDebugList, getDebugTitle }
    }
  });
</script>

<style lang="less">
  .ant-collapse {
    margin-bottom: 4px;
    overflow: hidden;
    border: 0px;
    border-radius: 2px;
  }
  .ant-collapse > .ant-collapse-item{
    margin-bottom: 4px;
    overflow: hidden;
    border: 0px;
    border-radius: 2px;
    border-bottom: 1px solid #ecf2ee;
  }
  .ant-collapse-icon-position-right > .ant-collapse-item > .ant-collapse-header{
    padding: 4px 12px 4px 4px;
    font-weight: bold;
    font-size: 12px;
    color: #7c8087;
  }

  .debugDeleteClass{
    color: slategrey;
    cursor: pointer;
    float: right;
  }
</style>
