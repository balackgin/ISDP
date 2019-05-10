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
          name: 'outsourcerSettlementPayList',
          text: '付款申请',
          icon: 'fa-receipt',
          route: {
            name: 'outsourcerSettlementPayList'
          }
        },{
          name: 'outsourcerSettlementList',
          text: '结算申请',
          icon: 'fa-hand-holding-usd',
          route: {
            name: 'outsourcerSettlementList'
          }
        } ]
      }
    }
  }
}
</script>
