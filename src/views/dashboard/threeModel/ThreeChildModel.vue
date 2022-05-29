<template>
  <ThreeModelHeader/>

  <div ref="thingsChildModelContainerRef" class="threeModelContainer"></div>
  <div class="loadProgressContainer" v-show="progressLoadSuccess">
    <Progress :showInfo="true" :step ="10" :percent="modelProgressPercentRef" v-show="progressLoadSuccess"
              style="margin-top: 20%; width:50%; margin-left:20%"/>
  </div>

</template>

<script lang="ts">
  import {defineComponent, nextTick, onBeforeUnmount, onMounted, Ref, ref} from "vue";
  import {Progress} from 'ant-design-vue';
  import ThreeModelHeader from "./ThreeModelHeader.vue";
  import {digitalTwinScene} from "/@/views/3d/ThingsScene";
  import {useRoute} from "vue-router";
  const childModelMap = new Map();
  childModelMap.set('glDetail', 'models/electric/glDetail.glb');

  export default defineComponent({
    name: 'ThreeChildModel',
    components: {ThreeModelHeader, Progress},
    setup() {

      const route = useRoute();
      const childModel = ref(route.params?.id).value as string;
      // 进度条变量
      const progressLoadSuccess = ref(true);
      const modelProgressPercentRef = ref(0);
      const thingsChildModelContainerRef = ref() as Ref<HTMLElement>; //容器

      const progressCallback = (progress) => {
        modelProgressPercentRef.value = progress;
        if (modelProgressPercentRef.value === 100) {
          progressLoadSuccess.value = false;
        }
      }

      async function initChildContainer(){
        await nextTick();
        if (!thingsChildModelContainerRef.value) {
          return;
        }

        digitalTwinScene.init(thingsChildModelContainerRef.value, {
          cameraX: -6,
          cameraY: 60,
          cameraZ: 0,
          cameraFov: 65,
          cameraNear: 0.1,
          cameraFar: 1000,
          canControls: true,
          sceneBackTransport: true,
        }, progressCallback, null);

        digitalTwinScene.loadGLTFModel(childModelMap.get(childModel));
      }

      async function destroyModel() {
        if (digitalTwinScene) {
          digitalTwinScene.disposeSceneObjs();
        }
      }

      onMounted(initChildContainer);
      onBeforeUnmount(destroyModel);
      return {thingsChildModelContainerRef, modelProgressPercentRef, progressLoadSuccess}
    }
  });
</script>

<style lang="less">
  .threeModelContainer{
    margin: 0 0;
    padding: 0 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(rgb(0 0 0), rgb(1,23,92));
    canvas{
      background-image: linear-gradient(rgb(0 0 0), rgb(1,23,92));
    }
  }
</style>
