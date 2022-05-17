<template>
  <div ref="tmContainerRef" style="margin: 0 0; padding: 0 0; width: 100%;height: 100%"></div>

  <div>

  </div>
</template>

<script lang="ts">
  import { PageEnum } from '/@/enums/pageEnum';
  import {defineComponent, nextTick, onMounted, Ref, ref} from 'vue';
  import {useUserStore} from "/@/store/modules/user";
  import {useGo} from "/@/hooks/web/usePage";
  import {ElectricPowerPlant} from "/@/views/dashboard/threeModel/ElectricPowerPlant";
  export default defineComponent({
    name: '3DModel',
    setup(){
      const tmContainerRef = ref() as Ref<HTMLElement>; //容器
      let electricPowerPlant = ref(null) as Ref<ElectricPowerPlant | null>;

      const go = useGo();
      const userStore = useUserStore();
      const threeMainModelPath = userStore.getUserInfo.threeModelPath as string;
      console.log(threeMainModelPath);
      if(!threeMainModelPath){
        go(PageEnum.BASE_HOME);
      }

      async function init() {
        await nextTick();
        if (!tmContainerRef.value) {
          return;
        }
        console.log(tmContainerRef.value.clientHeight)
        electricPowerPlant.value = new ElectricPowerPlant(tmContainerRef);
        electricPowerPlant.value.start();
      }

      onMounted(init);

      return {tmContainerRef}
    },
  });
</script>
