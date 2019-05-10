<template>
  <div class="login log-comm">
    <div class="logo"></div>
    <div class="title"
         v-if="userConfig.title">{{userConfig.title}}</div>
    <div class="login-box"
         :class="{other: !userConfig.allowRegister}">
      <div class="switch-btn"
           v-if="userConfig.allowRegister">
        <span v-if="!showForgetPass"
              :class="showLogin ? 'active': ''"
              @click="isLogin(true)">账号登录</span>
        <span v-if="!showForgetPass">丨</span>
        <span v-if="!showForgetPass"
              :class="!showLogin ? 'active': ''"
              @click="isLogin(false)">账号注册</span>
        <span v-if="showForgetPass"
              :class="!showLogin ? 'active': ''"
              @click="isLogin(false)">忘记密码</span>
      </div>
      <div class="content">
        <login v-if="showLogin"
               :options="{userConfig}"
               @callback="callback"
               @isForgetPass="isForgetPass"></login>
        <register @callback="callback"
                  v-else></register>
      </div>
    </div>
  </div>
</template>
<script>
import login from './components/login';
import register from './components/register';
import { mapState } from 'vuex';
export default {
  metaInfo(){
    return {
      title: this.userConfig.title
    }
  },
  components: {
    login,
    register
  },
  data() {
    return {
      showLogin: true,
      showForgetPass: false
    };
  },
  computed: {
    ...mapState({
      systemActive: (state) => state.common.systemActive || {}
    }),
    userConfig(){
      return this.systemActive.loginConfig || {};
    }
  },
  async created(){
    await this.$store.commit('common/DEL_TOKEN');
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    changeShowLogin(bool){
      this.showLogin = bool;
    },
    isLogin(data) {
      this.showLogin = data;
    },
    isForgetPass(args) {
      this.showForgetPass = args;
    }
  }
};
</script>

<style lang="less">
  .log-comm {
    background: #0a0a0a url(../../assets/images/bk_login.png) 50% 0 no-repeat;
    min-height: 100%;
    min-width: 100%;
    .logo {
      position: absolute;
      top: 270px;
      left: 0;
      z-index: 0;
      display: block;
      width: 50%;
      height: 150px;
      font-size: 32px;
      background: #000;
      filter: alpha(opacity=30);
      -moz-opacity: 0.3;
      -khtml-opacity: 0.3;
      opacity: 0.3;
    }
    .title {
      position: absolute;
      top: 320px;
      left: 0;
      display: block;
      width: 48%;
      text-align: right;
      font-size: 32px;
      color: #fff;
    }
    .login-box {
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      position: absolute;
      top: 240px;
      left: 49%;
      z-index: 5;
      display: block;
      width: 370px;
      height: 280px;
      color: #000;
      background: #fff;
      &.other {
        height: 240px;
        padding: 16px;
      }
      .switch-btn {
        display: flex;
        height: 54px;
        line-height: 54px;
        padding: 0 35px;
        justify-content: space-around;
        font-size: 18px;
        span {
          cursor: pointer;
          &:nth-child(2) {
            color: #ddd;
          }
        }
        .active {
          color: rgb(230, 91, 0);
        }
      }
      .el-form-item__label {
        width: 60px !important;
        padding: 0;
        font-weight: 700;
        color: #000;
      }
      .el-input {
        width: auto;
      }
      .el-input__inner {
        width: 200px;
        border-radius: 0;
        border: none;
        border-bottom: 1px solid #dcdfe6;
        margin-right: 12px;
      }
      .log-btn {
        button {
          width: 120px;
          border: none;
          &.el-button--button {
            color: #2e82ff;
            background: none;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
      .log-code {
        input {
          width: 100px;
        }
        .el-button {
          padding: 8px 12px;
        }
      }
    }
  }
</style>
