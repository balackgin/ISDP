<template>
  <el-menu :default-active="activeIndex"
           class="default-nav"
           mode="horizontal">
    <el-menu-item v-for="(item, index) of list"
                  :key="index"
                  :index="index + 1 +''">
      <router-link :to="{name: item.name ,query: $route.query}"
                   class="link">{{item.title}}</router-link>
    </el-menu-item>
    <div class="btns"
         v-if="$route.query.type === 'detail'">
      <span v-for="(btn,index) of btns"
            @click="backToMain"
            :key="index+''"><i :class="btn.icon"></i> {{btn.title}}</span>
    </div>
  </el-menu>
</template>

<script>
export default {
  data () {
    return {
      btns: [ {
        icon: 'icon common_btn_back_h',
        title: '返回',
        fnName: 'backToMain'
      } ]
    }
  },
  computed: {
    activeIndex() {
      const { name } = this.$route;
      let index = this.list.findIndex((item) => (item.name === name || item.name === 'projectAll'));
      if(index <= 0) return '1';
      return index + 1 + '';
    }
  },
  methods: {
    backToMain(){
      const {$route,$router} = this;
      $router.replace({
        name: $route.name,
        query: {
          id: $route.query.id
        }
      });
    }
  },
  props: {
    list: {
      type: Array,
      default() {
        return []
      }
    }

  }

}
</script>
<style lang="less" scoped>
  .default-nav {
    height: 38px;
    background-color: #f6f6f6;
    .el-menu-item {
      height: 100%;
      padding: 0;
      line-height: 1;
      &.is-active,
      &:hover {
        color: #f81b1b;
        border-bottom: 4px solid #f81b1b;
        background-color: transparent;
      }
      > a {
        height: 100%;
        padding: 0 20px;
        display: block;
      }
    }
    .btns {
      float: right;
      &:focus {
        outline: 0;
      }
      > span {
        height: 16px;
        line-height: 16px;
        cursor: pointer;
        color: #f81b1b;
        .icon.common_btn_back_h {
          display: inline-block;
          height: 12px;
          width: 14px;
          background-image: url(../../../../assets/images/common/common_btn_back_h.png);
          background-size: 100%;
        }
      }
    }
  }
</style>
