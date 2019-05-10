<template>
  <div class="login"
       :class="isForget ? 'forget-pass' : ''">
    <el-form :model="form"
             label-position="left"
             status-cion
             :rules="rule"
             ref="loginForm"
             label-width="68px"
             class="login-form">
      <el-form-item label="账号"
                    prop="username"
                    size="small"
                    class="log-tel">
        <el-input type="text"
                  v-model.trim="form.username"
                  auto-complete="off"
                  @keyup.native.enter="handleKeyupForSubmit"></el-input>
      </el-form-item>
      <el-form-item v-if="isPass || isForget"
                    :label=" !isPass && isForget ? '新密码': '密码'"
                    prop="password"
                    size="small"
                    class="log-password">
        <el-input type="password"
                  v-model.trim="form.password"
                  auto-complete="off"
                  @keyup.native.enter="handleKeyupForSubmit"></el-input>
      </el-form-item>
      <el-form-item v-if="isForget"
                    label="确认密码"
                    prop="repassword"
                    size="small"
                    class="log-password">
        <el-input type="password"
                  v-model.trim="form.repassword"
                  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="!isPass || isForget"
                    label="验证码"
                    prop="authCode"
                    size="small"
                    class="log-code">
        <el-input type="text"
                  v-model.trim="form.authCode"
                  auto-complete="off"
                  @keyup.native.enter="handleKeyupForSubmit"></el-input>
        <el-button type="default"
                   @click="sendCode"
                   :disabled="isResend"
                   size="small">{{resendCodeVal}}</el-button>
      </el-form-item>
      <div class="log-btn">
        <el-button type="button"
                   @click="chooseLoginType"
                   :style="{visibility: options.userConfig && options.userConfig.allowRegister ? 'visible' : 'hidden'}"
                   size="small">
          {{isPass ? '验证码登录' : '账号密码登录'}}
        </el-button>
        <el-button type="primary"
                   @click="loginClick('loginForm')"
                   size="small">{{isForget ? '提交': '登录'}}</el-button>
        <!-- <el-button v-if="!isForget"
                   type="button"
                   @click="forgetPass"
                   :style="{visibility: options.userConfig && options.userConfig.allowRegister ? 'visible' : 'hidden'}"
                   size="small">
          忘记密码
        </el-button> -->
      </div>
    </el-form>
  </div>
</template>
<script>
// const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      regexp: (state) => state.common.regexp,
      outsourcerInfo: (state) => state.outsourcer.common.outsourcerInfo,
      systemActive: (state) => state.common.systemActive || {},
      sessionRoute: (state) => state.common.sessionRoute || {}
    })
  },
  data() {
    let checkUserName = (rule, value, callback) => {
      if (!this.form.username) {
        return callback(new Error('请输入工号或手机号'));
      } else {
        callback();
      }
    };

    let validatePassword = (rule, value, callback) => {
      if (!this.form.password) {
        callback(new Error('请输入密码'));
      } else {
        callback();
      }
    };
    let validateRePassword = (rule, value, callback) => {
      if (!this.form.repassword) {
        callback(new Error('请输入确认新密码'));
      } else if (this.form.repassword !== this.form.password) {
        callback(new Error('确认新密码和新密码不一致'));
      } else {
        callback();
      }
    };
    let validateAuthCode = (rule, value, callback) => {
      if (!this.form.authCode) {
        callback(new Error('请输入验证码'));
      } else {
        callback();
      }
    };
    return {
      isPass: true,
      isResend: false,
      isForget: false,
      timer: null,
      resendCodeVal: '发送验证码',
      form: {
        username: '',
        authCode: '',
        password: '',
        repassword: '',
        loginType: '密码'
      },
      rule: {
        username: [ { validator: checkUserName, trigger: 'blur' } ],
        authCode: [ { validator: validateAuthCode, trigger: 'blur' } ],
        password: [ { validator: validatePassword, trigger: 'blur' } ],
        repassword: [ { validator: validateRePassword, trigger: 'blur' } ]
      }
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    loginClick(formName) {
      const { username, password,  authCode, repassword } = this.form;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if(this.isForget){
            this.setNewPassword({tel: username, password, authCode, repassword});
          }else if (this.isPass) {
            this.waitSuccess({ username, password, loginType: 'password' });
          } else {
            this.waitSuccess({ username, authCode, loginType: 'tel' });
          }
          this.$refs[formName].clearValidate();
        }
      });
    },
    chooseLoginType() {
      this.isPass = !this.isPass;
      this.isForget = false;
      this.$emit('isForgetPass', this.isForget);
      this.loginType = this.isPass ? 'tel' : 'password';
      this.$refs['loginForm'].clearValidate();
      clearTimeout(this.timer);
      this.resendCodeVal = '发送验证码';
      this.isResend = false;
    },
    forgetPass() {
      this.isPass = !this.isPass;
      this.isForget = !this.isForget;
      this.$emit('isForgetPass', this.isForget);
    },
    async waitSuccess(args) {

      const { systemActive }  = this,
        isAuthCode = args.loginType === 'tel';
      args.loginType = systemActive.name === 'outsourcer' ?  isAuthCode ? 'tel' : 'outside' : 'employee';
      let params = isAuthCode ? Object.assign({},args,{
        password: args.authCode
      }) : args
      isAuthCode && delete params.authCode;

      const { data,resultCode } = await this.$store.dispatch(
        'user/login',
        params
      );
      if ((resultCode === 'AU200' || +resultCode === 200) && data) {

        this.$store.commit('common/GET_SYSTEM',data.token);  // 存token

        let nextRouteName = systemActive.startRoute;

        if(systemActive.name === 'outsourcer'){  //外包商平台
          // 审批状态暂时没有 先使用id判断
          if(data.auth && ![ 'outside','tel' ].includes(data.auth)){
            this.$elMessage({
              message: '该帐号不允许登录!',
              type: 'error'
            });
            return false;
          }
          await this.$store.dispatch('outsourcer/common/getOutsourcerInfo',{
            loading: true
          });
          const {outsourcerInfo} = this;
          outsourcerInfo && !outsourcerInfo.isNull() && [ 'approving','finished' ].includes(outsourcerInfo.statusSign) ? nextRouteName = 'outsourcerBaseinfoIndex' :  '';
          await this.$store.dispatch('common/getUserInfo');
          this.$elMessage({
            message: '登录成功!',
            type: 'success'
          });

          this.$router.push({
            name: nextRouteName
          });
          return false;
        }

        else if(data.auth && [ 'outside','tel' ].includes(data.auth)){
          this.$store.commit('common/DEL_TOKEN');
          this.$elMessage({
            message: '该帐号不允许登录!',
            type: 'error'
          });
          return false;
        }


        const userData = await this.$store.dispatch('common/getUserInfo'),
          ISDPFlag = systemActive.name === 'ISDP';

        ISDPFlag ? this.$elTooltip({
          message: '登录成功!',
          type: 'success'
        }) :  this.$elMessage({
          message: '登录成功!',
          type: 'success'
        });


        const { prev = {} } = this.sessionRoute,
          {name: prevName = '',query: prevQuery} = prev,
          {projectId} = userData;

        this.$router.push({
          name: prevName || systemActive.startRoute,
          query: ISDPFlag ? projectId && {id: projectId} : prevQuery
        });
      }

    },
    async sendCode() {
      if (!this.regexp.isMobile.test(this.form.username)){
        this.$elMessage({
          message: '请输入正确的手机号码!',
          type: 'error'
        });
        return;
      };
      let {resultCode} = await this.$store.dispatch('user/getAuthCode',{
        tel: this.form.username
      });
      if(resultCode === 'AU202' || resultCode.includes('200')){
        let seconds = 60;
        this.isResend = true;
        this.resendCodeVal = seconds + 's';
        this.timer = setInterval(() => {
          if (seconds <= 0) {
            this.isResend = false;
            clearInterval(this.timer);
            return (this.resendCodeVal = '重新发送');
          }
          seconds--;
          this.resendCodeVal = seconds + 's';
        }, 1000);
      }

    },
    async setNewPassword(args) {
      const { resultCode, resultMessage } = await this.$store.dispatch('user/setNewPassword', args);
      this.$elMessage({
        type: +resultCode === 200 ? 'success' : 'error',
        message: resultMessage
      })
      if(+resultCode === 200) {
        this.isPass = false;
        this.isForget = false;
      }
    },
    handleKeyupForSubmit(){
      const { form, isPass, isForget } = this;
      if(isForget){
        form.username && form.password && form.authCode && form.repassword && this.loginClick('loginForm');
      }else if(isPass){
        form.username && form.password && this.loginClick('loginForm');
      }else{
        form.username && form.authCode && this.loginClick('loginForm');
      }
    }
  },
  props: {
    options: {
      default(){
        return {}
      },
      type: Object
    }
  }
};
</script>
<style lang="less" scoped>
  .login {
    margin-left: 48px;
    margin-top: 40px;
    &.forget-pass {
      margin-top: -12px;
      .el-form-item {
        margin-bottom: 12px;
      }
    }
  }
</style>
