<template>
  <div class="login">
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
                  v-model.number="form.username"
                  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-if="isForget"
                    label="密码"
                    prop="password"
                    size="small"
                    class="log-password">
        <el-input type="password"
                  v-model="form.password"
                  auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item v-else
                    label="验证码"
                    prop="authCode"
                    size="small"
                    class="log-code">
        <el-input type="password"
                  v-model="form.authCode"
                  auto-complete="off"></el-input>
        <el-button type="default"
                   @click="sendCode"
                   :disabled="isResend"
                   size="small">{{resendCodeVal}}</el-button>
      </el-form-item>
      <div class="log-btn">
        <el-button type="button"
                   @click="forgetPass(false)"
                   :style="{visibility: (isForget ? 'visible': 'hidden')}"
                   size="small">忘记密码</el-button>
        <el-button type="primary"
                   @click="loginClick('loginForm')"
                   size="small">登录</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
export default {
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
    let validateAuthCode = (rule, value, callback) => {
      if (!this.form.authCode) {
        callback(new Error('请输入验证码'));
      } else {
        callback();
      }
    };
    return {
      isForget: true,
      isResend: false,
      timer: null,
      resendCodeVal: '发送验证码',
      form: {
        username: '',
        authCode: '',
        password: '',
        loginType: '密码'
      },
      rule: {
        username: [ { validator: checkUserName, trigger: 'blur' } ],
        authCode: [ { validator: validateAuthCode, trigger: 'blur' } ],
        password: [ { validator: validatePassword, trigger: 'blur' } ]
      }
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  methods: {
    loginClick(formName) {
      const { username, password, loginType, authCode } = this.form;

      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isForget) {
            this.waitSuccess({ username, password, loginType: '密码' });
          } else {
            this.waitSuccess({ username, authCode, loginType: '手机验证码' });
          }
          this.$refs[formName].clearValidate();
        }
      });
    },
    forgetPass(param) {
      this.isForget = param;
      this.loginType = '验证码';
      this.$refs['loginForm'].clearValidate();
    },
    async waitSuccess(args) {
      const { data, resultMessage } = await this.$store.dispatch(
        'outsourcer/user/login',
        args
      );

      this.$store.dispatch('common/session', {
        key: 'token',
        val: data
      });
      if (data) {
        return this.$router.replace({
          name: 'outsourcerApply'
        });
      }
      this.$message.error(`${ resultMessage }`);
    },
    sendCode() {
      if (!this.form.username) return;
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
  }
};
</script>
<style lang="less" scoped>
  .login {
    margin-left: 48px;
    margin-top: 40px;
  }
</style>
