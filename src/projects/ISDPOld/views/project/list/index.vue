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
          name: routeConfig.projectList,
          text: '项目列表',
          icon: 'fa-list-ul',
          route: {
            name: routeConfig.projectList
          }
        },
        {
          name: routeConfig.projectDemo,
          text: 'DEMO',
          icon: 'fa-list-ul',
          route: {
            name: routeConfig.projectDemo
          }
        }
        ]
      }
    }
  }
}
</script>
