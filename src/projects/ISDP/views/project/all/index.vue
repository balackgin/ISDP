<template>
  <div class="project-all"
       ref="defaultAll">
    <!-- <default-nav :list="list"></default-nav> -->
    <inside-tabs :remoteData="remoteData"
                 :options="tabConfig"></inside-tabs>
    <router-view ref="views"></router-view>
  </div>
</template>

<script>
// import defaultNav from './components/defaultNav';
import insideTabs from '@ISDP/components/insideTabs';
import tabConfig from './config/navs.config';

export default {
  name: 'default-projecy',
  components: {
    // defaultNav,
    insideTabs
  },
  data() {
    return {
      tabConfig
      // list: [ {
      //   name: 'ISDPProjectAllDefault',
      //   title: '全部项目'
      // },
      // {
      //   name: 'ISDPProjectAllMyTask',
      //   title: '我的任务'
      // } ]
    }
  },
  computed: {
    remoteData(){
      const {query,name} = this.$route;
      return {
        showBackBtn: query.type === 'detail' || name === 'ISDPProjectAllMyTask',
        backRouteName: {
          name: 'ISDPProjectAllDefault',
          query: {
            id: query.id
          }
        }
      };
    }
  }

}
</script>

<style lang="less" scoped>
  .project-all {
    height: -ms-calc(100% - 40px);
    height: -webkit-calc(100% - 40px);
    height: -moz-calc(100% - 40px);
    height: calc(100% - 40px);
  }
</style>
