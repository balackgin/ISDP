<template>
  <el-container class="nisdp-layout-wrap nISDP-wrap">
    <el-header height="60px"
               class="layout-header-wrap">
      <layout-head></layout-head>
    </el-header>
    <el-container style="height:100%">
      <el-aside class="scrollbar layout-aside"
                width="248px">
        <layout-navs></layout-navs>
      </el-aside>
      <el-main class="main-wrap scrollbar">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import NProgress from 'nprogress';
import { mapState } from 'vuex';
// import store from '@/store';
const layoutHead = () => import('./components/layoutHead'),
  layoutNavs = () => import('./components/layoutNavs');
export default {
  computed: {
    ...mapState({
      menuObj: (state) => state.ISDP.common.menuObj || {},
      permissionMenu: (state) => state.ISDP.common.permissionMenu || [],
      systemActive: (state) => state.common.systemActive || {}
    })
  },
  components: {
    layoutHead,
    layoutNavs
  },
  methods: {
    async permissionFlag(toRoute,firstFlag){
      const {permissionMenu: perFlag,$route,systemActive} = this,
        startPage = systemActive.startRoute,
        {name,meta,query} = toRoute || $route;
      !perFlag.length && await this.$store.dispatch('ISDP/common/getMenuList',{
        projectId: query.id || 0
      });

      const {permissionMenu} = this,
        routeName = firstFlag && name === 'ISDPNotFound' && startPage;


      if(routeName && permissionMenu.includes(routeName)){
        return {
          name: startPage,
          query: query.toJson()
        };
      }else if(permissionMenu.includes(name) || meta.permission){
        return true;
      }
      return {
        name: 'ISDPNotFound',
        query: query.toJson()
      };
    }
  },
  beforeRouteEnter(to,from,next){
    next(async (vm) => {
      const flag = await vm.permissionFlag(undefined,true);

      to.name === from.name || to.name === flag.name || flag === true ? next() : vm.$router.replace({
        name: 'ISDPNotFound',
        query: to.query
      });
    });
  },
  async beforeRouteUpdate(to,from,next){
    const flag = await this.permissionFlag(to);

    flag === true || to.name == flag.name || from.name === to.name ? next() : (NProgress.done() && next({
      name: 'ISDPNotFound',
      query: to.query
    }))
  }
};
</script>

<style lang="less" scoped>
  .nisdp-layout-wrap {
    .layout-aside {
      padding-bottom: 20px;
      box-shadow: 2px 0px 14px 0px rgba(224, 217, 217, 0.2);
      background-color: #fff;
    }
    .main-wrap {
      overflow: auto;
    }
  }
</style>
<style lang="less"  src="./common.less">
</style>
