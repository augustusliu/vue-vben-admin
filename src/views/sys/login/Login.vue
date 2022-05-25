<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div class="login-header">
       <span class="-enter-x">
          <AppLogo :alwaysShowTitle="true" />
       </span>
      <span class="-enter-x">
         <AppLocalePicker
           class="absolute text-white top-4 right-4 enter-x "
           :showText="false"
           v-if="!sessionTimeout && showLocale"
         />
      </span>
    </div>
    <div class="container h-full w-full ">
        <div class="three-container" ref="containerRef"></div>
        <div class="login-desc" >
          <p>专注物联网与数字孪生解决方案</p>
        </div>
        <div :class="`${prefixCls}-form`" class="
              w-full
              px-5
              py-8
              mx-auto
              my-auto
              rounded-md
              shadow-md
              xl:ml-16 xl:bg-transparent
              sm:px-8
              xl:p-4 xl:shadow-none
              sm:w-3/4
              lg:w-2/4
              xl:w-auto
              enter-x"  style="position: absolute; top: 25%; left: 60%; z-index: 99;">
          <LoginForm/>
        </div>
    </div>
  </div>
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
  import {ThingsScene} from '/@/views/3d/ThingsScene';
  export default defineComponent({
    name: "LoginComponent",
    props: {
      sessionTimeout: {
        type: Boolean,
      },
    },
    components: {LoginForm, AppDarkModeToggle, AppLocalePicker, AppLogo},
    setup(){
      const threeSceneRef = ref(null) as Ref<ThingsScene | null>;
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
        threeSceneRef.value = new ThingsScene(containerRef, {
          cameraX: -1,
          cameraY: 3,
          cameraZ: 1,
          cameraFov: 65,
          cameraNear: 0.1,
          cameraFar: 1000,
          sceneColor:0x2941b3,
          canControls: false,
          sceneBackTransport:false,
        }, null, null);
        threeSceneRef.value.loadGLTFModel(logoModel);
      }

      async function disposeModel(){
        if(threeSceneRef.value){
          await threeSceneRef.value.disposeSceneObjs();
        }
      }
      onMounted(init);
      onBeforeUnmount(disposeModel);
      return {containerRef, prefixCls, showLocale, title, t};
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';
  @countdown-prefix-cls: ~'@{namespace}-countdown-input';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;
      .ant-input,
      .ant-input-password {
        background-color: #232a3b;
      }

      .ant-btn:not(.ant-btn-link):not(.ant-btn-primary) {
        border: 1px solid #4a5569;
      }

      &-form {
        background: transparent !important;
      }
      .app-iconify {
        color: #fff;
      }
    }

    input.fix-auto-fill,
    .fix-auto-fill input {
      -webkit-text-fill-color: #c9d1d9 !important;
      box-shadow: inherit !important;
    }
  }

  .@{prefix-cls} {
    min-height: 100%;
    overflow: hidden;
    background-color: #2942b3;
    &-form {
      background-color: #fff;
      z-index: 99;
    }
    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      /*margin-left: -48%;*/
      background-color: #2942b3;
      @media (max-width: @screen-xl) {
        display: none;
      }
    }

    .@{logo-prefix-cls} {
      position: absolute;
      top: 12px;
      height: 30px;

      &__title {
        font-size: 16px;
        color: #fff;
      }

      img {
        width: 32px;
      }
    }

    .container {
      .@{logo-prefix-cls} {
        position: absolute;
        width: 100%;
        height: 100%;
        top:60px;
      }
    }

    &-sign-in-way {
      .anticon {
        font-size: 22px;
        color: #888;
        cursor: pointer;

        &:hover {
          color: @primary-color;
        }
      }
    }

    input:not([type='checkbox']) {
      min-width: 360px;

      @media (max-width: @screen-xl) {
        min-width: 320px;
      }

      @media (max-width: @screen-lg) {
        min-width: 260px;
      }

      @media (max-width: @screen-md) {
        min-width: 240px;
      }

      @media (max-width: @screen-sm) {
        min-width: 160px;
      }
    }

    .@{countdown-prefix-cls} input {
      min-width: unset;
    }

    .ant-divider-inner-text {
      font-size: 12px;
      color: @text-color-secondary;
    }
    .three-container{
      top: 15%;
      width: 50% !important;
      height: 45% !important;
      position: absolute;
      z-index: 90;
      canvas {
        width: 100% !important;
        height: 100% !important;
      }
    }
    .login-desc {
      top: 65%;
      position: absolute;
      z-index: 90;
      padding-left: 150px;
      color: #fff;
      font-size: 30px;
    }
    .login-form{
      z-index: 99;
    }
    .login-header{
      width:100%;
      height: 50px;
    }
  }
</style>
