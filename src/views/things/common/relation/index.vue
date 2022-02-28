<template>
    <PageWrapper v-if="isLoaded"
      contentFullHeight
      fixedHeight
      :class="prefixCls">
      <G6Graph :data="entityRelationData" :afterClickCallback="afterClickCallback"/>
      <RelationModel @register="register" @success="handleSuccess" />
    </PageWrapper>
</template>

<script lang="ts">
  import { PageWrapper } from '/@/components/Page';
  import { G6Graph } from '/@/components/G6Graph';
  // import  G6DemoData  from './dataG6.json';
  import RelationModel from "./RelationModel.vue";
  import { relationAtlas } from '/@/api/things/relation/relationApi';
  import { useModal } from "/@/components/Modal";
  import {nextTick, onMounted, ref} from 'vue';
  export default {
    components: { G6Graph, PageWrapper, RelationModel },
    name: 'EntityRelation',
    props: ['entityId', 'entityType'],
    setup(props) {
      const entityIdRef = ref();
      const entityTypeRef = ref();
      const isLoaded = ref(false);
      const [register, { openModal }] = useModal();
      const afterClickCallback = (eId, eType) => {
        entityIdRef.value = eId;
        entityTypeRef.value = eType;
        openModal(true, {
          entityId: eId,
          entityType: eType,
        });
      }

      const entityRelationData = ref({});

      async function loadAtlasData(){
        await nextTick();
        let res = await relationAtlas({
          entityId: props.entityId,
          entityType: props.entityType,
          searchTypes: [props.entityType],
        });
        if(!res){
          return;
        }
        entityRelationData.value = res;
        isLoaded.value = true;
      }

      function handleSuccess(){

      }

      onMounted(loadAtlasData);
      return {
        prefixCls: 'page-custom',
        afterClickCallback,
        register,
        entityRelationData,
        isLoaded,
        entityIdRef,
        entityTypeRef,
        // G6DemoData,
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
