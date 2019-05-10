<template>
  <div></div>
</template>
<script>
import routeConfig from '@/route/config/oldISDP.config';
export default {
  async created(){
    // getProjectForApproval
    let {data,resultCode} = await this.$store.dispatch('common/getProjectForApproval',{
      approvalId: this.$route.query.id
    });
    if(resultCode && (+resultCode === 200 || resultCode.includes('200'))){
      const {businessId,formType} = data;
      // formType:
      // 外包商管理 :0     // managementOutsourcerDetail
      // 项目模式变更：1    // routeConfig.projectContract  query: approval/1
      // 里程碑计划：2     //routeConfig.projectManage
      // wbs计划：3       //routeConfig.projectPlan
      // 项目交底：4      //routeConfig.projectContract   query: disclose/2
      let nextRouteName = undefined,
        type = undefined;
      switch(formType){
      case 0:
        nextRouteName = 'managementOutsourcerDetail';
        break;
      case 1:
        nextRouteName = routeConfig.projectContract;
        type = 'approval';
        break;
      case 2:
        nextRouteName = routeConfig.projectManage;
        break;
      case 3:
        nextRouteName =  routeConfig.projectPlan;
        break;
      case 4:
        nextRouteName = routeConfig.projectContract;
        type = 'disclose';
        break;
      default:
        break;
      }
      nextRouteName && this.$router.replace({
        name: nextRouteName,
        query: {
          id: businessId,
          type
        }
      });
    }
  }
}
</script>
