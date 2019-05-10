<template>
  <el-container class="flex layout-wrap">
    <el-header class="flex layout-header">
      <div class="flex-auto">
        <router-link :to="{name: 'outsourcerHome'}"
                     class="logo">
          <img src="../../../../assets/images/logo.svg"
               alt="" />
        </router-link>
        <h1 class="title ml-1">项目外包管理平台</h1>
      </div>
      <div class="flex-item ml-5">
        <nav class="nav-wrap">
          <router-link class="link"
                       :to="{name: 'outsourcerBaseinfo'}">
            基本信息
          </router-link>
          <!-- <router-link class="link"
                       :to="{name: 'project'}">
            项目信息
          </router-link> -->
          <!-- <router-link class="link"
                       :to="{name: 'settlement'}">
            结算
          </router-link> -->
        </nav>
      </div>
      <div class="flex-auto">
        <div class="user-wrap">
          <el-dropdown class="user-dropdown">
            <el-button type="text"
                       class="link">
              {{userinfo.username || outsourcerInfo.contactMan || userinfo.tel}}
              <!-- <i class="el-icon el-icon-arrow-down el-icon--right"></i> -->
            </el-button>
            <el-dropdown-menu slot="dropdown"
                              class="user-dropdown-menu">
              <!-- <el-dropdown-item>
                基本资料
              </el-dropdown-item>
              <el-dropdown-item>
                用户设置
              </el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
          <a href="#"
             class="link ml-1"
             @click.prevent="exit">退出</a>
        </div>
      </div>
    </el-header>
    <router-view></router-view>
  </el-container>
</template>

<script>
import { mapState } from 'vuex';
export default {
  name: 'Layout',
  data() {
    return {
      visible: false
    };
  },
  // metaInfo: {
  //   // if no subcomponents specify a metaInfo.title, this title will be used
  //   title: "DIPP",
  //   // all titles will be injected into this template
  //   titleTemplate: "%s | partner"
  // },
  computed: {
    ...mapState({
      userinfo: (state) => state.common.userinfo || {},
      outsourcerInfo: (state) => state.outsourcer.common.outsourcerInfo || {}
    })
  },
  methods: {
    async exit(){
      await this.$store.dispatch('common/session',{key: 'token', action: 'del'});
      this.$router.push({
        name: 'outsourcerLogin'
      });
    }
  }
};
</script>
<style lang="less" scoped>
  @headHei: 60px;
  .layout-wrap {
    .layout-header {
      position: relative;
      z-index: 2;
      background-color: #35425f;
      .link {
        line-height: @headHei;
        color: rgba(255, 255, 255, 0.7);
        &:hover {
          color: #fff;
        }
      }
      .title,
      .logo {
        color: #fff;
        line-height: @headHei;
      }
      .logo {
        width: 108px;
        display: inline-block;
        vertical-align: middle;
        img {
          width: 100%;
          max-height: 60px;
        }
      }
      .title {
        display: inline;
        font: 14px Helvetica Neue, Helvetica, PingFang SC, Tahoma, Arial,
          sans-serif;
        font-size: 18px;
        font-weight: 700;
      }
      .nav-wrap {
        height: 100%;
        .link {
          height: 100%;
          padding: 0 20px;
          border-bottom: 5px solid transparent;
          line-height: @headHei;
          display: inline-block;
          color: rgba(255, 255, 255, 0.7);
          &:hover,
          &.router-link-active {
            color: #fff;
            border-color: #ef4d4d;
          }
        }
      }
      .user-wrap {
        padding-right: 32px;
        .user-dropdown {
          .link {
            padding: 0;
            .el-icon {
              margin-left: 0;
              position: relative;
              transition: transform 0.4s;
            }
            &:hover {
              .el-icon {
                transform: rotate(180deg);
              }
            }
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .user-dropdown-menu {
    margin-top: 0 !important;
    .popper__arrow {
      display: none;
    }
  }
</style>
