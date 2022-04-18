<template>
  <PageWrapper v-if="isLoaded">
    <Description @register="registerAlarmInfo"
                 :collapseOptions="{ canExpand: true }"
                 class="mt-4" />
    <a-divider />
    <BasicTable @register="registerDealTable" />
  </PageWrapper>
</template>

<script lang="ts">
  import { defineComponent, onMounted, ref} from 'vue';
  import {useRoute, useRouter} from 'vue-router';
  import { PageWrapper } from '/@/components/Page';
  import { Description, useDescription } from '/@/components/Description/index';
  import { ScrollContainer } from "/@/components/Container";
  import { alarmInfoScheme, alarmDealedColumn} from './alarm.data';
  import {useMultipleTabStore} from "/@/store/modules/multipleTab";
  import {getAlarmInfoApi, listAlarmLogsApi} from "/@/api/things/alarm/alarmApi";
  import { BasicTable, useTable } from '/@/components/Table';

  export default defineComponent({
    name: 'AlarmDescription',
    components: {PageWrapper, Description, ScrollContainer, BasicTable},
    setup(){
      const route = useRoute();
      const router = useRouter();
      const tabStore = useMultipleTabStore();
      const alarmId = ref(route.params?.id).value as string;
      const alarmInfo: any = ref({});
      const alarmLogsRef: any = ref([]);
      // 页面是否加载成功
      const isLoaded = ref(false)

      // 获取资产详情信息
      async function initLoadAlarmInfo(){
        const res = await getAlarmInfoApi(alarmId);
        if(!res){
          return;
        }
        alarmInfo.value = res
        await tabStore.updateTabTitle('(告警)'+ res.alarmName, router.currentRoute.value);
        isLoaded.value = true;

        await loadAlarmLogs();
      }

      const [registerAlarmInfo] = useDescription({
        title: '告警基础信息',
        bordered: false,
        data: alarmInfo,
        schema: alarmInfoScheme,
      });

      async function loadAlarmLogs(){
        const alarmLogs = await listAlarmLogsApi(alarmInfo.value.id);
        if(!alarmLogs){
          return;
        }
        alarmLogsRef.value = alarmLogs;
      }

      // 获取处理记录
      const [registerDealTable] = useTable({
        title: '处理记录',
        columns: alarmDealedColumn,
        pagination: false,
        dataSource: alarmLogsRef,
        showIndexColumn: true,
        scroll: { y: 300 },
      });


      onMounted(initLoadAlarmInfo);
      return {isLoaded, registerAlarmInfo, registerDealTable}
    }
  });
</script>
