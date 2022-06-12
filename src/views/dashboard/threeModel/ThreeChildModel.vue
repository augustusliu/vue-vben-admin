<template>
  <ThreeModelHeader/>
  <div class="h-full w-full childModelContainer">
  <canvas ref="thingsChildModelContainerRef" class="threeModelContainer"></canvas>
    <Row style="height: 100%; margin-top: 50px;">
      <Col span="7">
        <div class="modelInfoContainer">
          <div class="modelInfoHeader">基本信息</div>
          <Description @register="registerAssetInfo"
                       :collapseOptions="{ canExpand: false }"
                       class="mt-4" v-if="assetIsLoaded"/>
        </div>
        <div class="modelInfoContainer">
          <div class="modelInfoHeader">监控设备</div>
        </div>
      </Col>

      <Col span="7" offset="10">
        <div class="modelInfoContainer">
          <div class="modelInfoHeader">运行状态</div>
        </div>
        <div class="modelInfoContainer">
          <div class="modelInfoHeader">实时监控</div>
        </div>
      </Col>
    </Row>
  </div>

  <div class="loadProgressContainer" v-show="progressLoadSuccess">
    <Progress :showInfo="true" :step ="10" :percent="modelProgressPercentRef" v-show="progressLoadSuccess"
              style="margin-top: 20%; width:50%; margin-left:20%"/>
  </div>

</template>

<script lang="ts">
  import {defineComponent, nextTick, onBeforeUnmount, onMounted, Ref, ref} from "vue";
  import {Progress, Row, Col} from 'ant-design-vue';
  import ThreeModelHeader from "./ThreeModelHeader.vue";
  import { ThingsGuoluChildScene } from '/@/badylon/ThingsGuoluChildScene';
  import { useRoute } from "vue-router";
  import { Description, useDescription} from "/@/components/Description";
  import { modelAssetInfoScheme } from "/@/views/dashboard/threeModel/components/ChildModelAsset";

  export default defineComponent({
    name: 'ThreeChildModel',
    components: {ThreeModelHeader, Progress, Row, Col, Description},
    setup() {

      const route = useRoute();
      const childModel = ref(route.params?.id).value as string;
      const parentAssetCode = ref(route.params?.aId).value as string;

      const assetIsLoaded = ref(false);
      const assetInfoRef = ref();

      // 进度条变量
      const progressLoadSuccess = ref(true);
      const modelProgressPercentRef = ref(0);
      const thingsChildModelContainerRef = ref() as Ref<HTMLCanvasElement>; //容器
      const thingsGuoluChildSceneRef = ref() as Ref<ThingsGuoluChildScene>;
      const progressCallback = (progress) => {
        modelProgressPercentRef.value = progress;
        if (modelProgressPercentRef.value === 100) {
          progressLoadSuccess.value = false;
        }
      }

      const [registerAssetInfo] = useDescription({
        title: '',
        bordered: false,
        data: assetInfoRef,
        schema: modelAssetInfoScheme,
      });

      async function initChildContainer(){
        await nextTick();
        if (!thingsChildModelContainerRef.value) {
          return;
        }

        thingsGuoluChildSceneRef.value = new ThingsGuoluChildScene(thingsChildModelContainerRef.value,
          progressCallback, parentAssetCode, childModel);
      }

      async function destroyModel() {
        if (thingsGuoluChildSceneRef.value) {
          thingsGuoluChildSceneRef.value.disposeScene();
        }
      }

      onMounted(initChildContainer);
      onBeforeUnmount(destroyModel);
      return {thingsChildModelContainerRef, modelProgressPercentRef, progressLoadSuccess, registerAssetInfo, assetIsLoaded}
    }
  });
</script>

<style lang="less">

  .childModelContainer{
    width: 100%;
    height: 100%;
    top: 0;
    left:0;
    position: fixed;
    z-index: 90;
    background-image: linear-gradient(rgb(0 0 0), rgb(1,23,92));
    .modelInfoContainer{
      width: 100%;
      height: 50%;
      border: 1px solid #aaaaaa;
      .modelInfoHeader{
        color: #989292;
        width: 100%;
        max-height: 32px;
        line-height: 32px;
        font-size: 14px;
        font-weight: bold;
        vertical-align: center;
        padding-left: 15px;
        border-left: 3px solid #80ff00;
        background-image: linear-gradient(to right, #0a1f49, #547b95);
      }
      .ant-descriptions-item-label, .ant-descriptions-item-content{
        color: #989292 !important;
      }
    }

    .ant-row{
      margin: 0 0;
      padding: 0 0;
    }
  }

  .threeModelContainer{
    width: 100%;
    height: 100%;
    /*border: 1px solid red;*/
    left: 0;
    top:0;
    position: fixed;
  }

</style>
