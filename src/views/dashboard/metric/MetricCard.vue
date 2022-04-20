<template>
  <div class="md:flex">
    <template v-for="(item, index) in cardMetrics" :key="item.metricType">
      <Card
        size="small"
        :loading="$attrs.loading"
        class="md:w-1/4 w-full !md:mt-0 !mt-4"
        :class="[index + 1 < 4 && '!md:mr-4']"
        :style="{'background-color': item.color.cardColor}"
        :canExpan="false">

        <!--   动态数字变化     -->
        <div class="py-4 px-4 flex justify-between">
          <span class="text-1xl" :style="{'color':item.color.fontColor}">{{ item.metricName }}</span>
          <CountTo :startVal=0 :endVal="item.metricValue" :color="item.color.fontColor" class="text-5xl" style="float: right"/>
        </div>

        <Divider style="margin: 10px 0px"/>
        <div class="px-4 flex justify-between" v-show="item.metricTotalName" style="color: #aea3ad">
          <span>{{ item.metricTotalName }}</span>
          <CountTo :startVal=0 :endVal="item.metricTotalValue" class="text-2xl"/>
        </div>
      </Card>
    </template>
  </div>
</template>
<script lang="ts">
  import {defineComponent, ref} from 'vue';
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
  }

  export default defineComponent({
    name: 'MetricCard',
    components: { CountTo, Tag, Card, Icon ,Divider},
    setup() {
      const cardMetrics = ref<MetricCardItem[]>([]);

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
        }))
        cardMetrics.value = Array.from(res);
      }

      // 2、初始化统计数据
      function init(){
        loadCardMetrics('');
      }
      init();
      return { cardMetrics };
    },
  });
</script>
