<template>
    <PageWrapper
      contentFullHeight
      fixedHeight
      :class="prefixCls">
      <G6Graph :data="G6DemoData" :afterClickCallback="afterClickCallback"/>
      <RelationModel @register="register" @success="handleSuccess" />
    </PageWrapper>

</template>

<script lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { G6Graph } from '/@/components/G6Graph';
  import  G6DemoData  from './dataG6.json';
  import RelationModel from "./RelationModel.vue";
  import {useModal} from "/@/components/Modal";
  import { ref } from 'vue';
  export default {
    components: { G6Graph, PageWrapper, RelationModel },
    name: 'EntityRelation',
    setup() {
      const entityId = ref();
      const entityType = ref();
      const [register, { openModal }] = useModal();

      const afterClickCallback = (eId, eType) => {
        entityId.value = eId;
        entityType.value = eType;
        openModal(true, {
          entityId: eId,
          entityType: eType,
        });
      }
      function handleSuccess(){

      }

      return {
        prefixCls: 'page-custom',
        afterClickCallback,
        register,
        entityId,
        entityType,
        G6DemoData,
        handleSuccess
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
