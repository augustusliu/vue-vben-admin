<template>
  <PageWrapper class="h-full w-full things-login-page-container">
    <!--  头部  -->
    <div class="lg:flex md:flex" style="height: 50px; height:10%;">
      <div class="lg:w-5/10 w-full enter-y ">
        <AppLogo :alwaysShowTitle="true" class="text-white things-logo"/>
      </div>
      <div class="lg:w-5/10 w-full enter-y">
        <AppLocalePicker class="text-white things-local"
          :showText="false"
          v-if="!sessionTimeout && showLocale"
        />
      </div>
    </div>

    <div class="lg:flex md:flex w-full h-full things-content-container">
      <div class="lg:w-5/10 md:w-5/10 enter-y">
        <div ref="containerRef" class="w-full three-container"></div>
        <div class="w-full login-desc">
          <span>物联网+数字孪生平台</span>
        </div>
      </div>

      <div class="lg:w-5/10 md:w-5/10 w-full enter-y">
        <div class="login-form-container">
          <LoginForm/>
        </div>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent, ref, nextTick, computed, Ref, onMounted, onBeforeUnmount } from "vue";
  import { AppLogo } from '/@/components/Application';
  import { AppLocalePicker, AppDarkModeToggle } from '/@/components/Application';
  import LoginForm from './LoginForm.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useLocaleStore } from '/@/store/modules/locale';
  import { digitalTwinScene } from '/@/views/3d/ThingsScene';
  import {PageWrapper} from "/@/components/Page";
  export default defineComponent({
    name: "LoginComponent",
    props: {
      sessionTimeout: {
        type: Boolean,
      },
    },
    components: {LoginForm, AppDarkModeToggle, AppLocalePicker, AppLogo, PageWrapper},
    setup(){
      const containerRef = ref() as Ref<HTMLElement>; //容器
      const globSetting = useGlobSetting();
      const { prefixCls } = useDesign('login');
      const { t } = useI18n();
      const localeStore = useLocaleStore();
      const showLocale = localeStore.getShowPicker;
      const title = computed(() => globSetting?.title ?? '');
      const logoModel = 'models/logo.glb';

      async function init() {
        await nextTick();
        if (!containerRef.value) {
          return;
        }
        // 透明背景
        digitalTwinScene.init(containerRef.value, {
          cameraX: -1,
          cameraY: 3,
          cameraZ: 1,
          cameraFov: 65,
          cameraNear: 0.1,
          cameraFar: 1000,
          canControls: false,
          sceneBackTransport:true,
          animateInterval:30,
        }, null, null);
        digitalTwinScene.loadGLTFModel(logoModel);
      }

      async function disposeModel(){
        if(digitalTwinScene){
          await digitalTwinScene.disposeSceneObjs();
        }
      }
      onMounted(init);
      onBeforeUnmount(disposeModel);
      return {containerRef, prefixCls, showLocale, title, t};
    },
  });
</script>
<style lang="less">
  .things-login-page-container{
    background-color: #2941b3;
    margin: 0 0;
    padding: 0 0;
    .vben-page-wrapper-content{
      margin: 0 0;
      padding: 0 0;
    }
  }
  .things-logo{
    float: left;
    vertical-align: center;
    margin-left: 15px;
    color: #ffffff;
    font-family: tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53', sans-serif;
  }
  .things-local{
    float: right;
    margin-top: 8px;
    margin-right: 15px;
  }
  .things-content-container{
    height: 90%;
  }
  .three-container{
    background-color: #2941b3;
    canvas {
      background-color: #2941b3;
      width: 100% !important;
      height: 100% !important;
    }
  }
  .login-desc {
    min-height: 100px;
    max-height: 100px;
    line-height: 100px;
    text-align: center;
    color: #fff;
    font-size: 30px;
    font-family: fantasy, cuisive, tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53', sans-serif;
  }

  .login-form-container{
    background-color: #fff;
    width: 400px;
    height: 380px;
    padding: 20px 20px;
    border-radius: 5px;
    margin-top: 22%;
    margin-left: 15%;
  }
  .ant-divider-inner-text{
    color: #7c8087;
    font-size: 12px;
  }
</style>
