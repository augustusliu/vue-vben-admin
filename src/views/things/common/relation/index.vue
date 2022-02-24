<template>
    <PageWrapper
      title="实体关系图谱"
      content="用于展示当前企业相关资产、设备关系图"
      contentFullHeight
      fixedHeight >
      <G6Graph :data="G6DemoData"/>
    </PageWrapper>

</template>

<script lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { G6Graph } from '/@/components/G6Graph';
  import  G6DemoData  from './dataG6.json';
  export default {
    components: { G6Graph, PageWrapper },
    setup() {
      return { G6DemoData };
    },
  };
</script>
