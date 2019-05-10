<template>
  <div class="inside-tabs-wrap flex">
    <nav class="navs flex-item flex">
      <router-link :to="{name: navItem[keyValue.routeName || 'routeName' ],query: $route.query}"
                   class="link flex-auto"
                   :class="{active: $route.name === navItem[keyValue.routeName || 'routeName' ]}"
                   v-for="navItem of navsConfig.data"
                   :key="navItem[keyValue.text || 'text']">
        {{ navItem[keyValue.text || 'text'] }}

      </router-link>
    </nav>
    <div class="flex-auto btns">
      <router-link :to="remoteData.backRouteName || {name: btnsConfig.back.routeName,query: $route.query}"
                   v-if="remoteData.showBackBtn"
                   class="back">
        <img class="is-disabled"
             src="@ISDP/assets/images/common/common_btn_back_d.png"
             alt="">
        <img class="is-normal"
             src="@ISDP/assets/images/common/common_btn_back_n.png"
             alt="">
        <img class="is-hover"
             src="@ISDP/assets/images/common/common_btn_back_h.png"
             alt="">
        返回
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    navsConfig(){
      return this.options.navs || {data: []};
    },
    btnsConfig(){
      return this.options.btns || {back: {}};
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    remoteData: {
      type: Object,
      default(){
        return {}
      }
    },
    keyValue: {
      type: Object,
      default(){
        return {
          text: 'text',
          routeName: 'routeName'
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .inside-tabs-wrap {
    border-bottom: 1px solid #d7d7d7;
    .navs {
      .link {
        position: relative;
        top: 1px;
        height: 38px;
        padding: 0 20px;
        border-bottom: 4px solid transparent;
        font-size: 14px;
        color: #777a80;
        &.active {
          color: #f00000;
          border-color: #f81b1b;
        }
      }
    }
    .btns {
      .back {
        img {
          margin-right: 2px;
          display: none;
          &.is-normal {
            display: inline-block;
          }
        }
        color: #f81b1b;
        &.is-disabled {
          img {
            display: none;
            &.is-disabled {
              display: inline-block;
            }
          }
          color: #b6b6b6;
        }
        &:hover {
          img {
            display: none;
            &.is-hover {
              display: inline-block;
            }
          }
          color: #e20000;
        }
      }
    }
  }
</style>
