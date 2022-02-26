<template>
    <PageWrapper
      contentFullHeight
      fixedHeight
      :class="prefixCls">
      <G6Graph :data="G6DemoData" :afterClickCallback="afterClickCallback"/>
      <RelationModel @register="register" />
    </PageWrapper>

</template>

<script lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { G6Graph } from '/@/components/G6Graph';
  import  G6DemoData  from './dataG6.json';
  import RelationModel from "./RelationModel.vue";
  import {useModal} from "/@/components/Modal";
  export default {
    components: { G6Graph, PageWrapper, RelationModel },
    name: 'EntityRelation',
    setup() {

      const [register, { openModal }] = useModal();

      const afterClickCallback = (entityId, entityType) => {
        console.log('节点id', entityId, '节点类型', entityType);
        openModal(true, {});
      }

      return {
        prefixCls: 'page-custom',
        afterClickCallback,
        register,
        G6DemoData
      };
    },
  };
</script>

<style lang="less">
  .page-custom {
    .vben-page-wrapper-content{
      margin: 0;
    }
  }
</style>
