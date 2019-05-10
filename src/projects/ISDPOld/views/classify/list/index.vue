<template>
  <model-layout :options="layoutConfig">
    <template slot="main">
      <router-view></router-view>
    </template>
  </model-layout>
</template>
<script>
import modelLayout from '@/components/modelLayout';
export default {
  components: {
    modelLayout
  },
  data(){
    return {
      layoutConfig: {
        navs: [ {
          name: 'ISDPOClassifyList',
          text: '项目列表',
          icon: 'fa-list-ul',
          route: {
            name: 'ISDPOClassifyList'
          }
        }
        ]
      }
    }
  }
}
</script>
