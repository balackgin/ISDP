<template>
  <el-container class="layout-body-container">
    <el-aside class="layout-aside">
      <slot name="prev"></slot>
      <nav class="nav-wrap"
           v-if="options.navs">
        <router-link :to="item.route"
                     class="link"
                     v-for="item of options.navs"
                     :key="item.text"
                     :class="item.className">
          <i class="icon fa"
             :class="item.icon"></i>
          {{item.text}}
        </router-link>
      </nav>
    </el-aside>
    <el-main class="layout-main">
      <div class="right-main-wrap">
        <div class="right-main-box">
          <slot name="main"></slot>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script>
export default {
  name: 'modelLayout',
  props: {
    options: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .layout-body-container {
    margin-top: 40px;
    .layout-aside {
      @wid: 200px;
      width: @wid !important;
      flex-basis: @wid;
      .nav-wrap {
        .link {
          margin-bottom: 14px;
          padding-left: 20px;

          color: #333;
          font-size: 14px;
          display: block;
          .icon {
            @hei: 36px;
            width: @hei;
            height: @hei;
            // border-radius: 4px;
            border-radius: 50%;
            margin-right: 14px;
            box-shadow: 0 2px 4px 0 #ddd;
            line-height: @hei;
            text-align: center;
            background-color: #fff;
            color: #404040;
            font-size: 16px;
            display: inline-block;
            vertical-align: middle;
          }
          &.active,
          &.router-link-active {
            .icon {
              background-color: #ff7575;
              color: #fff;
            }
          }
        }
      }
    }
    .layout-main {
      padding: 0;
      .right-main-wrap {
        position: relative;
        height: 100%;
        padding: 0 20px 60px 0;
        .right-main-box {
          position: relative;
          height: 100%;
        }
      }
    }
  }
</style>
<style lang="less">
  .layout-body-container {
    .layout-main {
      .right-main-box {
        // padding: 10px 40px;
        // background-color: #fff;
        & > * {
          min-height: 100%;
          padding: 10px 40px;
          background-color: #fff;
          &.noPadding {
            padding: 0;
          }
        }
      }
    }
  }
</style>
