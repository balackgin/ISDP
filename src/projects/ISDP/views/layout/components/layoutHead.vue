<template>
  <el-row type="flex"
          class="layout-header-wrap"
          :detailData="detailData">
    <el-col class="flex-auto head-aside">
      <router-link :to="{name: systemActive.startRoute,query: {id: $route.query.id}}"
                   class="logo-link">
        <img src="@ISDP/assets/images/nav/logo.png"
             alt>
      </router-link>
    </el-col>
    <el-col class="flex-item head-main">
      <el-row type="flex">
        <el-col class="flex-item navs-wrap">
          <span class="project-name"
                v-if="['ISDPProjectHome','ISDPProgressHome'].includes($route.name) || $route.name === 'ISDPProjectAllDefault' && $route.query.type === 'detail'">
            <!-- 我的项目: ISDPProjectAllDefault   默认项目: ISDPProjectHome 整体进度浏览: ISDPProgressHome -->
            {{detailData.contractName}}
          </span>
          <el-breadcrumb separator=">"
                         v-else>
            <el-breadcrumb-item v-for="(item,idx) of breadcrumbData"
                                :key="idx">{{item.elementName}}</el-breadcrumb-item>
          </el-breadcrumb>
        </el-col>
        <el-col class="flex-auto user-wrap flex">
          <div class="flex-auto">
            <!-- <a href="#"
               @click.prevent
               class="link">
              <img src="@ISDP/assets/images/nav/nav_icon_user.png"
                   alt="">
              系统管理员
            </a>-->
            <inside-dropdown class="layout-inside-dropdown"
                             :options="dropConfig"
                             @callback="callback">
              <img slot="prev"
                   src="@ISDP/assets/images/nav/nav_icon_user.png"
                   alt>
            </inside-dropdown>
          </div>
          <div class="flex-auto">
            <a href="#"
               class="link"
               @click.prevent="helpBtn">
              <img src="@ISDP/assets/images/nav/nav_icon_help.png"
                   alt>
              帮助
            </a>
          </div>
        </el-col>
      </el-row>
    </el-col>
    <help-document v-if="documentVisible"
                   :documentVisible.sync="documentVisible"></help-document>
  </el-row>
</template>
<script>
import { mapState } from 'vuex';
import insideDropdown from '@ISDP/components/insideDropdown';
import dropConfig from './config/drop.config';
import helpDocument from './components/helpDocument.vue';
export default {
  components: {
    insideDropdown,
    helpDocument
  },
  data() {
    return {
      documentVisible: false
    };
  },
  computed: {
    ...mapState({
      userinfo: (state) => state.common.userinfo || {},
      systemActive: (state) => state.common.systemActive || {},
      menuObj: (state) => state.ISDP.common.menuObj || {},
      detailData: (state) => state.ISDP.project.detailData || {}
    }),
    dropConfig() {
      const { nickname, username } = this.userinfo;
      dropConfig.btn.text = nickname || username;
      return dropConfig;
    },
    breadcrumbData() {
      const { $route, menuObj } = this;
      return menuObj[$route.name] || [];
    }
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    userExit() {
      const sys = this.systemActive;
      this.$router.push({
        name: sys.login
      });
    },
    helpBtn() {
      this.documentVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
  @headerHeight: 60px;
  .layout-header-wrap {
    height: 100%;
    .head-aside {
      @wid: 248px;
      flex-basis: @wid;
      max-width: @wid;
      width: @wid;
      background-color: #e20000;
      text-align: center;
      line-height: @headerHeight;
      .logo-link {
        display: block;
        text-align: center;
      }
    }
    .head-main {
      padding-left: 0.21875rem /* 42/192 */;
      background-color: #35425f;
      .navs-wrap {
        .project-name {
          color: #fff;
          line-height: 60px;
          font-size: 14px;
        }
      }
      /deep/ .el-breadcrumb {
        line-height: @headerHeight;
        .el-breadcrumb__item {
          .el-breadcrumb__inner {
            color: #fff;
          }
          .el-breadcrumb__separator {
            color: #fff;
          }
        }
      }
      .user-wrap {
        padding-right: 16px;
        .flex-auto {
          padding: 0 16px;
          line-height: @headerHeight;
          color: #fff;
          font-size: 14px;
          .link {
            color: #fff;
            font-size: 14px;
            img {
              @wid: 18px;
              width: @wid;
              height: @wid;
              margin-right: 4px;
            }
          }
          & ~ .flex-auto {
            position: relative;
            &::before {
              content: '|';
              position: absolute;
              left: 0;
              top: 0;
              color: rgba(20, 34, 64, 0.8);
            }
          }
        }
        /deep/ .inside-dropdown-menu-wrap {
          line-height: 1.5;
        }
      }
    }
  }
</style>
