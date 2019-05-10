<template>
  <div class="my-task">
    <div class="wbs-task">
      <model-table :data="taskList"
                   :pagination="taskPagination"
                   :options="taskConfig"
                   @callback="callback"></model-table>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import modelTable from '@/components/modelList/modelTable';
// import insideHead from '@/components/'
import taskConfig from './config/task.config.json';
const TASK_TYPE = {
  wbs: 'ISDPPorjectStartWBSTask',  ///wbs任务
  risk: 'ISDPRiskMaintenance',  //风险及问题
  out_plan: 'ISDPProgressExternalFeedback'  //外场实施子计划
}
export default {
  name: 'my-task',
  components: {
    modelTable
  },
  data () {
    return {
      taskConfig,
      taskList: [],
      taskPagination: {
        theme: 'isdp',
        pageNum: 1,
        pageCount: 20,
        total: 0,
        layout: 'total,prev,pager,next,sizes,jumper'
      }
    }
  },
  computed: {
    ...mapState({
      username(state) {
        return state.common.userinfo.username || ''
      }
    })
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    async getProjectTask() {
      const { pageNum, pageCount } = this.taskPagination;
      const { data, resultCode = '' } = await this.$store.dispatch('ISDP/project/getProjectTask', {
        argsMap: {
          receiverId: this.username,
          isDeal: 0,
          projectId: this.$route.query.id
        },
        pageNum,
        pageCount
      });
      console.log(data.toJson(),'data');
      if(+resultCode === 200 || resultCode.includes('200')){
        const { totalElements, content = [] } = data;
        this.taskPagination.total = totalElements;
        this.taskList = content;
      }
    },
    // async getEmployeeInfo() {
    //   const { data } = this.$store.dispatch('user/getEmployeeInfo');
    // },
    paginationCallback(num) {
      this.taskPagination.pageNum = num;
      this.getProjectTask();
    },
    pagiantionSizeChange(num){
      this.taskPagination.pageCount = num;
      this.getProjectTask();
    },
    handleClickForTypeLink(form) {
      const { businessType,projectId, businessNo } = form;
      let query = {
        businessNo,
        projectId,
        id: this.$route.query.id
      };
      this.$router.push({
        query,
        name: TASK_TYPE[businessType]
      });
      // businessType === 'wbs' && +isDeal === 4 ? 'ISDPPorjectStartWBSMaintain' :
    }
  },
  async created() {
    await this.getProjectTask();
  }
}
</script>

<style lang="less" scoped>
  .my-task {
    margin-top: 30px;
    height: 100%;
    .title {
      padding: 15px;
      line-height: 32px;
      font-size: 18px;
    }
  }
</style>
