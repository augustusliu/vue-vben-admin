<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <Row class="enter-x">
      <Col :span="24">
        <FormItem :style="{ 'text-align': 'right' }">
          <Button type="link" size="small" @click="setLoginState(loginStatePassword)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </Col>
    </Row>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>

    <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>
    <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <WechatFilled />
      <AlipayCircleFilled />
    </div>
  </Form>
</template>
<script lang="ts">
  import { defineComponent,reactive, ref, toRaw, unref, computed } from 'vue';
  import {Form, Input, Row, Col, Button, Divider, FormItem, InputPassword} from 'ant-design-vue';
  import {
    WechatFilled,
    AlipayCircleFilled
  } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';

  const formData = reactive({
    account: 'augustus',
    password: '123456',
  });

  export default defineComponent({
    name:'LoginFormComponent',
    components: { Col, Row, Form, FormItem,  Input, InputPassword, LoginFormTitle, WechatFilled, AlipayCircleFilled, Button, Divider},
    setup(){
      const { t } = useI18n();
      const loginStatePassword = LoginStateEnum.RESET_PASSWORD;
      const { notification, createErrorModal } = useMessage();
      const { prefixCls } = useDesign('login');
      const userStore = useUserStore();

      const { setLoginState, getLoginState } = useLoginState();
      const { getFormRules } = useFormRules();

      // 动态响应，监听基本类型变化
      const formRef = ref();
      const loading = ref(false);
      const { validForm } = useFormValid(formRef);
      // 判断是否显示登陆
      const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

      async function handleLogin() {
        const data = await validForm();
        if (!data) return;
        try {
          loading.value = true;
          const userInfo = await userStore.login(
            toRaw({
              password: data.password,
              username: data.account,
              mode: 'none', // 如果出现错误，错误显示的方式是弹出还是默认的错误提示信息
            })
          );
          if (userInfo) {
            notification.success({
              message: t('sys.login.loginSuccessTitle'),
              description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
              duration: 3,
            });
          }
        } catch (error) {
          createErrorModal({
            title: t('sys.api.errorTip'),
            content: error.message || t('sys.api.networkExceptionMsg'),
            getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
          });
        } finally {
          loading.value = false;
        }
      }
      return {formData, getFormRules, formRef, getShow, handleLogin, setLoginState,loginStatePassword, t ,loading};
    }

  });

</script>
