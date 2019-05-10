<template>
  <model-layout :options="layoutConfig">
    <template slot="main">
      <router-view></router-view>
    </template>
  </model-layout>
</template>
<script>
import modelLayout from '@/components/modelLayout';
import routeConfig from '@/route/config/oldISDP.config';
export default {
  components: {
    modelLayout
  },
  data(){
    return {
      layoutConfig: {
        navs: [ {
          name: routeConfig.colonyList,
          text: '项目列表',
          icon: 'fa-list-ul',
          route: {
            name: routeConfig.colonyList
          }
        }
          ,{
          name: routeConfig.colonyBusiness,
          text: '商机列表',
          icon: 'fa-chart-line',
          route: {
            name: routeConfig.colonyBusiness
          }
        },{
          name: routeConfig.colonyReport,
          text: '项目报表',
          icon: 'fa-chart-line',
          route: {
            name: routeConfig.colonyReport
          }
        }
        ]
      }
    }
  }
}
</script>
