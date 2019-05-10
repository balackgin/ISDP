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
  data(){
    return {
      layoutConfig: {
        navs: [
          {
            name: 'managementOutsourcerApply',
            text: '外包商纳入审核',
            icon: 'fa-hands-helping',
            route: {
              name: 'managementOutsourcerApply'
            }
          },
          // {
          //   name: 'managementOutsourcerApply',
          //   text: '外包商等级评定',
          //   icon: 'fa-award',
          //   route: {
          //     name: 'managementOutsourcerApply'
          //   }
          // },
          {
            name: 'managementOutsourcerLibrary',
            text: '外包商库',
            icon: 'fa-layer-group',
            route: {
              name: 'managementOutsourcerLibrary'
            }
          }
          // {
          //   name: 'managementOutsourcerApply',
          //   text: '外包商信息变更',
          //   icon: 'fa-file-signature',
          //   route: {
          //     name: 'managementOutsourcerApply'
          //   }
          // }
        ]
      }
    }
  },
  components: {
    modelLayout
  }
}
</script>
