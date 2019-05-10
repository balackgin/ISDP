<template>
  <div class="login log-comm">
    <div class="logo"></div>
    <div class="title">外包工程商管理平台</div>
    <div class="login-box">
      <div class="switch-btn">
        <span :class="showLogin ? 'active': ''"
              @click="isLogin(true)">账号登录</span>
        <span>丨</span>
        <span :class="!showLogin ? 'active': ''"
              @click="isLogin(false)">账号注册</span>
      </div>
      <div class="content">
        <login v-if="showLogin"></login>
        <register v-else></register>
      </div>
    </div>
  </div>
</template>
<script>
import login from './login';
import register from './register';
export default {
  data() {
    return {
      showLogin: true,
      showRegister: false
    };
  },
  components: {
    login,
    register
  },
  methods: {
    isLogin(data) {
      this.showLogin = data;
    }
  }
};
</script>

<style lang="less">
  .log-comm {
    background: #0a0a0a url(../../../../assets/images/bk_login.png) 50% 0
      no-repeat;
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
          &:first-child {
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
