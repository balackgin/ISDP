<!--<script src="../../route/index.js"></script>-->
<template>
  <el-container class="layout-wrap">
    <!--header信息-->
    <el-header class="flex layout-header"
               height="50">
      <div class="flex-auto"
           v-show="isShow">
        <strong class="title ml-1">集成项目交付平台管理系统</strong>
      </div>
      <div class="flex-item ml-5">
        <el-button class="layout-reordey"
                   @click="toggle()">
          <i class="el-icon-document"
             v-show="downIcon"></i>
          <i class="el-icon-tickets"
             v-show="!downIcon"></i>
        </el-button>
      </div>
      <div class="flex-auto">
        <div class="user-wrap">
          <el-dropdown class="user-dropdown">
            <el-button type="text"
                       class="link">
              {{nickname}}
              <!--<i class="el-icon el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
            </el-button>
            <el-dropdown-menu slot="dropdown"
                              class="user-dropdown-menu">
            </el-dropdown-menu>
          </el-dropdown>
          <el-button class="link ml-1"
                     @click.prevent="exit">退出
          </el-button>
        </div>
      </div>
    </el-header>
    <el-container class="layout-wrap">
      <!--导航部分-->
      <el-aside width="230px"
                class="layout-aside"
                v-show="isShow">
        <el-menu class="layout-menu"
                 :router="true"
                 default-active="1"
                 :unique-opened="true"
                 active-text-color="#fff"
                 background-color="#3A4651"
                 text-color="#9CA2A8">
          <el-submenu v-for="(item, index) of Config"
                      :key="index + ''"
                      :index="index + 1 + ''"
                      class="layout-submenu">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.label }}</span>
            </template>
            <el-menu-item v-for="(node, index) of item.childNodes"
                          :key="index + ''"
                          :index="node.route">{{ node.label }}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container class="layout-wrap">
        <!--main内容部分-->
        <el-main class="layout-main">
          <router-view></router-view>
        </el-main>
        <el-footer class="layout-footer"
                   height="50">
          <p>
            ©Copyright 2019
            <a href="#">大华股份</a>
          </p>
        </el-footer>
      </el-container>

    </el-container>
  </el-container>
</template>
<script>
import Config from './config/user.config';
import { mapState } from 'vuex';
export default {
  name: 'Layout',
  data() {
    return {
      Config,
      dialogVisible: false,
      isShow: true,
      downIcon: true
    }
  },
  computed: {
    ...mapState({
      nickname: (state) => state.common.userinfo && state.common.userinfo.nickname || ''
    })
  },
  methods: {

    async exit() {
      // 退出登陆界面
      await this.$store.dispatch('common/session', {key: 'token', action: 'del'});
      this.$router.push({
        name: 'sysLogin'
      })
    },
    toggle() {
      this.isShow = !this.isShow;
      this.downIcon = !this.downIcon;
    }
  }
}
</script>

<style lang="less" scoped>
  @headHei: 50px;
  .layout-wrap {
    font-family: Microsoft YaHei;
    height: 100%;

    .layout-header {
      position: absolute;
      padding: 0;
      background-color: #d7dde4;

      .link {
        color: #4f5f6f;
      }

      .ml-1 {
        border-color: transparent;
        background-color: rgba(255, 255, 255, 0);
        height: @headHei;
      }

      .title {
        color: #fff;
        line-height: @headHei;
        display: inline-block;
        margin: 0;
        width: 230px;
        height: @headHei;
        background-color: #3a4651;
        font-weight: normal;
        font-size: 14px;
        text-align: center;
      }

      .ml-5 {
        margin-left: 16px;

        .layout-reordey {
          padding-top: 15px;
          color: #7e8e9f;
          background-color: #d7dde4;
          border: none;

          i {
            font-size: 18px;
          }
        }
      }

      .link {
        height: 100%;
        padding: 0 20px;
        border-bottom: 5px solid transparent;
        line-height: @headHei;
        display: inline-block;
        color: #4f5f6f;
      }
    }

    .user-wrap {
      padding-right: 16px;
      height: 50px;

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

    .layout-aside {
      background-color: #3a4651;
      height: 100%;

      .layout-menu {
        margin-top: 50px;

        .layout-submenu {
          width: 230px;
          border-top: 1px solid #333e48;
          color: #9ca2a8;
        }

        .outline {
          border-bottom: 1px solid #333e48;
        }
      }
    }

    .layout-main {
      height: 100%;
      padding: 5px;
      background-color: #f0f3f6;
      margin-top: 50px;
    }

    .layout-footer {
      width: 100%;
      background-color: #ffffff;
      color: #999999;
      line-height: @headHei;
      font-size: 12px;

      a {
        color: #999999;

        &:hover {
          color: #33be85;
        }
      }
    }
  }
</style>
<style lang="less">
  .el-menu-item.is-active {
    background-color: rgb(46, 57, 66) !important;
  }
  .user-dropdown-menu {
    margin-top: 0 !important;

    .popper__arrow {
      display: none;
    }
  }
</style>
