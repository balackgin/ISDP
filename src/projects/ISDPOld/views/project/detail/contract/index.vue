<template>
  <div class="project-detail-contract-wrap noPadding">
    <el-tabs type="border-card"
             v-model="name">
      <el-tab-pane v-for="item of tabs"
                   :label="item.title"
                   :name="item.name"
                   :key="item.name"
                   v-if="item.name === 'projectDisclousure' ? +detailData.isConfirmProjectModel === 2 &&  (roleAll || userinfo.usertype.includes('pmo')) : true">
        <!-- <component
                     :is="item.name"></component> -->
      </el-tab-pane>
    </el-tabs>
    <div class="tab-content">
      <keep-alive>
        <component :is="name"></component>
      </keep-alive>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import Config from './config/contract.config';
const tem = () => ({
    template: '<div></div>'
  }),
  projectApproval = () => import('./components/projectApproval'),
  projectDisclousure = () => import('./components/projectDisclousure'),
  projectBidding = () => import('./components/projectBidding'),
  projectContractReview = () => import('./components/projectContractReview.vue');

export default {
  components: {
    projectApproval,
    bidding: projectBidding,
    contractReview: projectContractReview,
    noContract: tem,
    projectDisclousure
  },
  computed: {
    ...mapState({
      detailData: (state) => {
        let detail = state.ISDPOld.project.detailData || {};
        return detail.data || {};
      },
      userinfo: (state) => state.common.userinfo || {},
      /**
       * 项目经理（PM）      PM
       * 技术负责人（TD）    D_TD
       * 软件交付经理        D_SDM
       * 解决方案负责人      T_SOLUTION_LEADER
       * 销售负责人          T_SALE_LEADER
       */
      roleAll(state)  {
        // 项目经理，技术负责人，软件交付经理，售前工程师，销售负责人，交付管理人员
        let roleObj = state.ISDPOld.project.roleAll || {},
          projectManagerSuperior = state.ISDPOld.project.projectManagerSuperior,
          {detailData,userinfo} = this,
          roleArr = [ ...(roleObj.D_TD || []),...(roleObj.D_SDM || []),...(roleObj.T_SOLUTION_LEADER || []),...(roleObj.T_SALE_LEADER || []),...(roleObj.D_SE || []) ],
          bool = roleArr.some((item) => item.staffNo === userinfo.username);
        return bool || (detailData && [ detailData.businessOwnerNo,detailData.projectManagerNo ].includes(userinfo.username)) || projectManagerSuperior
      }
    })
  },
  data() {
    return {
      name: 'projectApproval',  //projectApproval   projectDisclousure
      tabs: Config.tabs
    };
  },
  methods: {
    async getTeamList(){
      const { id } = this.$route.query;
      if(id){
        await this.$store.dispatch('ISDPOld/project/getTeamMember',{
          projectId: id
        });
      }
    }
  },
  created () {
    const {type} = this.$route.query;
    this.getTeamList();
    let name = '';

    switch(type){
    case 'approval':
    case '1':
      name = 'projectApproval';
      break;
    case 'disclose':
    case '2':
      name = 'projectDisclousure';
      break;
    case 'bidding':
    case '3':
      name = 'bidding';
      break;
    case 'contarct':
    case '4':
      name = 'contractReview';
      break;
    default:
      break;
    }
    name ? this.name = name : '';
  }
};
</script>
<style lang="less">
  .project-detail-contract-wrap {
    .el-tabs {
      border: 0;
      box-shadow: none;
      .el-tabs__header {
        .el-tabs__item {
          &,
          &:hover {
            color: #333;
          }
        }
      }
    }
    .tab-content {
      padding: 0 20px;
    }
  }
</style>
