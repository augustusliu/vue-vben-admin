<template>
  <div :class="prefixCls">
    <Popover trigger="click"
             :visible="popoverVisible"
             :onVisibleChange="popoverVisibleChange"
             :overlayClassName="`${prefixCls}__overlay`">
      <Badge dot :numberStyle="numberStyle">
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs>
          <template v-for="item in listData" :key="item.key">
            <TabPane>
              <template #tab>
                {{ item.name }}
                <span v-if="item.list.length !== 0">({{ item.list.length }})</span>
              </template>
              <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
              <NoticeList :list="item.list" v-if="item.key === '1'" @title-click="onNoticeClick" />
              <NoticeList :list="item.list" v-else />
            </TabPane>
          </template>
        </Tabs>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts">
  import {defineComponent, ref, Ref} from 'vue';
  import {Badge, Popover, Tabs} from 'ant-design-vue';
  import {BellOutlined} from '@ant-design/icons-vue';
  import {ListItem, TabItem} from './data';
  import NoticeList from './NoticeList.vue';
  import {useDesign} from '/@/hooks/web/useDesign';
  import {thingsWebSocket} from '../../ws/ThingsWebSocket';
  import {listAlarmApi} from "/@/api/things/alarm/alarmApi";
  import {AlarmListItem, AlarmParams} from "/@/api/things/alarm/model/alarmModel";
  import moment from "moment";
  import {useGo} from "/@/hooks/web/usePage";


  export default defineComponent({
    components: { Popover, BellOutlined, Tabs, TabPane: Tabs.TabPane, Badge, NoticeList },
    setup() {
      const go = useGo();
      const { prefixCls } = useDesign('header-notify');
      const popoverVisible = ref(false);
      const listData = ref([]) as Ref<TabItem[]>;
      const alarmSearchParam = {dealStatus: false, pageSize: 5} as AlarmParams;

      async function loadAlarms(){
        const alarms = await listAlarmApi(alarmSearchParam);
        if(alarms && alarms.items  && alarms.items.length > 0){
          const alarmNotifyData = alarmConvert(alarms.items);
          listData.value.push(alarmNotifyData);
        }
      }

      const alarmConvert = (items:AlarmListItem[]) => {
        const tabItem = {
          key: '1',
          name: '告警信息',
          list: [] as ListItem[],
        } as TabItem;

        items.forEach(item => {
          tabItem.list.push({
            id: item.id,
            title: item.alarmContent,
            description: item.alarmContent,
            type: 1,
            datetime: moment(Number(item.createdTime)).format('YYYY-MM-DD HH:mm:ss')
          });
        })
        return tabItem;
      }

      async function popoverVisibleChange(popoverShow:boolean){
        if(popoverShow){
          await loadAlarms();
          popoverVisible.value = true;
        }else{
          listData.value = [];
          popoverVisible.value = false;
        }
      }

      function onNoticeClick(record: ListItem) {
        go('/alarm_detail/' + record.id);
      }

      // 启动websocket
      thingsWebSocket.init();

      return {
        prefixCls,
        listData,
        onNoticeClick,
        popoverVisibleChange,
        popoverVisible,
        numberStyle: {},
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-header-notify';

  .@{prefix-cls} {
    padding-top: 2px;

    &__overlay {
      max-width: 360px;
    }

    .ant-tabs-content {
      width: 300px;
    }

    .ant-badge {
      font-size: 18px;

      .ant-badge-multiple-words {
        padding: 0 4px;
      }

      svg {
        width: 0.9em;
      }
    }
  }
</style>
