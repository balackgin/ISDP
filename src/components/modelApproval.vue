<template>
  <section>
    <iframe :src="approvalUrl"
            v-if="!!approvalUrl"
            class="frame w-100 mt-2"
            name="approval"
            frameborder="0"></iframe>
    <el-button class="refreshBtn"
               v-show="false"
               @click="refreshFn"></el-button>
  </section>
</template>
<script>
import {mapState} from 'vuex';
export default {
  data(){
    return {
      approvalUrl: ''
    }
  },
  computed: {
    ...mapState({
      detailData: (state) => state.ISDPOld.project.detailData && state.ISDPOld.project.detailData.data,
      projectManager: (state) => state.ISDPOld.project.projectManager,
      userinfoOA: (state) => state.ISDPOld.project.userinfoOA || {},
      systemActive: (state) => state.common.systemActive || {}
    })
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    async getApprovalUrl(){

      const {detailData,projectManager,options,userinfoOA,$route} = this,
        {projectId,type} = options || {};

      let { data } = await this.$store.dispatch('common/getApproval',{
        projectId: projectId || $route.query.id,
        formType: type,
        change: projectManager && detailData.planApprovalStatus === 'NOT_COMMIT',
        leaderNo: userinfoOA.FSuperiorItemNumber
      });
      this.approvalUrl = data;
    },
    async refreshFn(){
      const {$route,systemActive} = this;
      systemActive.name === 'OISDP' && await this.$store.dispatch('ISDPOld/project/getProjectDetail',{
        id: $route.query.id
      });
      this.getApprovalUrl();
      // this.updateData();
      this.callback('approvalRefresh');
    }
  },
  created () {
    this.getApprovalUrl();
  },
  props: {
    options: {
      type: Object,
      default(){
        return {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .frame {
    height: 600px;
  }
</style>
