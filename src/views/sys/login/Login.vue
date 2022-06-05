<template>
  <canvas ref="containerRef" class="w-full three-container"></canvas>
  <div class="things-login-page-container">
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
        <div class="w-full login-desc">
          <span class="platformNameCn">物联孪生平台</span><br>
          <span class="platformNameEn">Thingsay IOT Twinning Platform</span>
        </div>
      </div>

      <div class="lg:w-5/10 md:w-5/10 w-full enter-y">
        <div class="login-form-container">
          <LoginForm/>
        </div>
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
  import {PageWrapper} from "/@/components/Page";
  import {thingsLogoBabylon, ThingsLogoBasicScene} from "/@/badylon/ThingsLogoBasicScene";
  export default defineComponent({
    name: "LoginComponent",
    props: {
      sessionTimeout: {
        type: Boolean,
      },
    },
    components: {LoginForm, AppDarkModeToggle, AppLocalePicker, AppLogo, PageWrapper},
    setup(){
      const containerRef = ref() as Ref<HTMLCanvasElement>; //容器
      const globSetting = useGlobSetting();
      const { prefixCls } = useDesign('login');
      const { t } = useI18n();
      const localeStore = useLocaleStore();
      const showLocale = localeStore.getShowPicker;
      const title = computed(() => globSetting?.title ?? '');

      const thingsBasicScene = ref() as Ref<ThingsLogoBasicScene>;

      async function init() {
        await nextTick();
        if (!containerRef.value) {
          return;
        }

        thingsLogoBabylon.init(containerRef.value);
        thingsLogoBabylon.loadLogoModel('logo.glb');
        thingsBasicScene.value = thingsLogoBabylon;
      }

      async function disposeModel(){
        if(thingsBasicScene.value){
          thingsBasicScene.value.dispose();
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
    margin: 0 0;
    padding: 0 0;
    opacity: 0.9;
    z-index: 99;
    position: fixed;
    width: 100%;
    height: 100%;
    .vben-page-wrapper-content{
      margin: 0 0;
      padding: 0 0;
    }
  }
  .things-logo{
    float: left;
    vertical-align: center;
    margin-left: 15px;
    color: #878183;
    font-family: tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53', sans-serif;
  }
  .things-local{
    float: right;
    margin-top: 8px;
    margin-right: 15px;
  }
  .things-content-container{
    height: 90%;
    .login-desc {
      min-height: 42px;
      max-height: 42px;
      line-height: 42px;
      text-align: center;
      font-family: cuisive, tahoma, arial, 'Hiragino Sans GB', '\5b8b\4f53', sans-serif;
    }
    .platformNameCn{
      font-size: 32px;
      color: #878183;
    }
    .platformNameEn{
      font-size: 12px;
      color: #bec0c7;
      font-weight: bolder;
    }
  }
  .three-container{
    background-image: linear-gradient(rgb(0,1,4), rgb(1,11,47));
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 5;
  }


  .login-form-container{
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
