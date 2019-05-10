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
          name: routeConfig.sysRoles,
          text: '角色管理',
          icon: 'fa-list-ul',
          route: {
            name: routeConfig.sysRoles
          }
        }
        ]
      }
    }
  }
}
</script>
