<template>
  <div class="register">
    <el-form :model="form"
             label-position="left"
             status-cion
             :rules="rule"
             ref="registForm"
             label-width="68px"
             class="regist-form">
      <!-- <el-form-item label="申请人"
                    prop="user"
                    size="small"
                    class="log-usernick">
        <el-input type="text"
                  v-model.number="form.user"
                  auto-complete="off"
                  @keyup.native.enter="handleKeyupForSubmit"></el-input>
      </el-form-item> -->

      <el-form-item label="手机号"
                    prop="tel"
                    size="small"
                    class="log-tel">
        <el-input type="text"
                  v-model.trim="form.tel"
                  auto-complete="off"
                  @keyup.native.enter="handleKeyupForSubmit"></el-input>
        <el-button type="default"
                   @click="sendCode"
                   :disabled="isResend"
                   size="small">{{resendCodeVal}}</el-button>
      </el-form-item>
      <el-form-item label="密码"
                    prop="password"
                    size="small">
        <el-input type="password"
                  v-model.trim="form.password"
                  auto-complete="off"
                  key="password"
                  @keyup.native.enter="handleKeyupForSubmit"></el-input>
      </el-form-item>
      <el-form-item label="验证码"
                    prop="authCode"
                    class="log-code">
        <el-input type="text"
                  v-model.trim="form.authCode"
                  size="small"
                  key="authCode"
                  auto-complete="off"
                  @keyup.native.enter="handleKeyupForSubmit">
        </el-input>
        <el-button type="danger"
                   class="register-btn"
                   size="small"
                   @click="register('registForm')">注册</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import { mapState } from 'vuex';
// const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
export default {
  computed: {
    ...mapState({
      regexp: (state) => state.common.regexp
    })
  },
  data() {
    let checkTel = (rule, value, callback) => {
      if (!this.form.tel) {
        return callback(new Error('请输入手机号'));
      } else if (!this.regexp.mobile.test(this.form.tel)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };

    // let validateUser = (rule, value, callback) => {
    //   if (!this.form.user) {
    //     callback(new Error('请输入申请人'));
    //   } else {
    //     callback();
    //   }
    // };
    let validateCode = (rule, value, callback) => {
      if (!this.form.authCode) {
        callback(new Error('请输入验证码'));
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
    return {
      isResend: false,
      timer: null,
      resendCodeVal: '发送验证码',
      form: {
        tel: '',
        authCode: '',
        // user: '',
        password: ''
      },
      rule: {
        tel: [ { require: true, validator: checkTel, trigger: 'blur' } ],
        authCode: [ { require: true, validator: validateCode, trigger: 'blur' } ],
        // user: [ { require: true, validator: validateUser, trigger: 'blur' } ],
        password: [
          { require: true, validator: validatePassword, trigger: 'blur' }
        ]
      }
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    switchLogin() {
      this.callback('changeShowLogin',true);
    },
    async register(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.registResult();
        } else {
          console.log('error submit!!');
        }
      });
    },
    async registResult() {
      const { user, tel, password, authCode } = this.form;
      const { resultCode,resultMessage } = await this.$store.dispatch('user/register', {
        user,
        tel,
        password,
        authCode
      });
      if(resultCode === 'PLU201'){
        this.form = Object.assign({},{
          tel: '',
          authCode: '',
          user: '',
          password: ''
        });
        this.switchLogin();
        this.$elMessage({
          message: resultMessage || '用户注册成功',
          type: 'success'
        });
      }
    },
    async sendCode() {
      if (!this.regexp.isMobile.test(this.form.tel)){
        this.$elMessage({
          message: '请输入正确的手机号码!',
          type: 'error'
        });
        return;
      }
      let {resultCode} = await this.$store.dispatch('user/getAuthCode',{
        tel: this.form.tel
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
    handleKeyupForSubmit(){
      const {form,regexp} = this;
      if(regexp.mobile.test(form.tel) &&  form.authCode && form.password){
        this.register('registForm');
      }
    }
  }
};
</script>
<style lang="less">
  .register {
    margin-left: 48px;
    margin-top: 20px;
    .log-tel {
      input {
        width: 100px !important;
        padding: 0 8px;
      }
      .el-button {
        padding: 8px 12px;
      }
    }
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 12px;
    }
    .log-code {
      position: relative;
      .switch-login {
        position: absolute;
        font-size: 12px;
        bottom: 0px;
        display: flex;
        color: #666;
        height: 12px;
        right: 22px;
        &:hover {
          color: #d50000;
          cursor: pointer;
        }
      }
      input {
        width: 100px !important;
      }
      .register-btn {
        width: 80px;
        background: #d50000;
        text-align: center;
        span {
          text-align: center;
          margin-left: 5px;
          letter-spacing: 10px;
        }
        &:hover {
          opacity: 0.7;
        }
      }
    }
  }
</style>
