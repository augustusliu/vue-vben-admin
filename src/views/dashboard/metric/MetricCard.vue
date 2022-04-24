<template>
  <div class="md:flex">
    <template v-for="(item, index) in cardMetrics" :key="item.metricType">
      <Card
        size="small"
        :loading="loading"
        :title="item.metricName"
        class="md:w-1/5 w-full !md:mt-0 !mt-5"
        :class="[index + 1 < 5 && '!md:mr-5']"
        :canExpan="false">

        <!--   动态数字变化     -->
        <div class="py-4 px-4 flex justify-between">
          <CountTo :startVal=0 :endVal="item.metricValue" :color="item.iconColor" class="text-4xl"/>
          <Icon :icon="item.icon" :size="40" :color="item.iconColor"/>
        </div>
        <div class="p-2 px-4 flex justify-between" v-show="item.metricTotalName" style="color: #aea3ad">
          <span>{{ item.metricTotalName }}</span>
          <CountTo :startVal=0 :endVal="item.metricTotalValue" class="text-2xl"/>
        </div>
      </Card>
    </template>
  </div>
</template>
<script lang="ts">
  import {defineComponent, onMounted, ref} from 'vue';
  import { CountTo } from '/@/components/CountTo';
  import { Icon } from '/@/components/Icon';
  import { Tag, Card , Divider} from 'ant-design-vue';
  import { getMetricCards } from  '/@/api/things/metrics/metricApi';
  import {CardColor, randomMetricCardColor} from '/@/utils/color';

  // 定义卡片显示数据格式
  export interface MetricCardItem {
    metricType: string;
    metricName: string;
    metricValue: number;

    metricTotalName: string;
    metricTotalValue: number;
    color: CardColor;
    icon: string;
    iconColor: string;
  }

  export default defineComponent({
    name: 'MetricCard',
    components: { CountTo, Tag, Card, Icon ,Divider},
    setup() {
      const cardMetrics = ref<MetricCardItem[]>([]);
      const loading = ref(true);
      // 1、加载卡片统计数据
      async function loadCardMetrics(metricType: string){
        const data = await getMetricCards(metricType);
        if(!data){
          return;
        }
        const res: MetricCardItem[] = [];
        data.forEach(item => res.push({
          metricType: item.metricType,
          metricName: item.metricName,
          metricValue: Number(item.metricValue),
          metricTotalName: item.metricTotalName ? item.metricTotalName:'',
          metricTotalValue: item.metricTotalValue ? Number(item.metricTotalValue) : 0,
          color: randomMetricCardColor(),
          icon: item.icon,
          iconColor: item.iconColor,
        }))
        cardMetrics.value = Array.from(res);
        loading.value = false;
      }

      // 2、初始化统计数据
      function init(){
        loadCardMetrics('');
      }
      onMounted(init);
      return { cardMetrics, loading };
    },
  });
</script>
