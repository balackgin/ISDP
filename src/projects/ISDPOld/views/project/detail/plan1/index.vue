<template>
  <div class="project-detail-plan comm">
    <keep-alive>
      <wbs ref="wbs"
           @getTask="getTaskList"
           @changeSaveStatus="changeSaveStatus"></wbs>
    </keep-alive>
    <!-- 分派弹窗 start -->
    <!-- <outside-dialog :options="dialogConfig.assignment"
                    :form="assignmentForm"
                    :show="assignmentDialogShow"
                    @callback="handleCallback"></outside-dialog> -->
    <!-- 分派弹窗 end -->
    <!-- {{projectModel}} -->
    <div v-if="projectModel ==='LARGE' && taskData.length"
         class="mb-1">
      <div class="txt"><span>任务列表</span><span class="line"></span></div>
      <model-table :options="tableConfig"
                   :data="taskData"
                   :fns="tableActions"
                   @callback="callback">
        <template slot="expand"
                  slot-scope="expandScope">
          <plan-task-expand :options="expandScope.rowData"
                            :data="expandData"
                            @callback="callback"></plan-task-expand>
        </template>
      </model-table>

      <task-dialog :params.sync="taskDialogParams"
                   @callback="callback"></task-dialog>
      <plan-task-dialog :show="taskFeedbackDialogShow"
                        :detailData="currentTaskFeedback"
                        @callback="callback"></plan-task-dialog>
    </div>
    <div class="project-approval-list mt-2"
         v-if="approvalList.length">
      <model-table :options="approvalConfig.approvalList"
                   :data="approvalList"></model-table>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import outsideDialog from '@/components/outsideDialog';
import approvalConfig from '../contract/config/projectApproval.config';
import modelTable from '@/components/modelList/modelTable';
import taskConfig from './config/task.config.json';
import taskDialog from '../components/taskDialog';
import planTaskDialog from '../components/planTaskItemDialog';
import planTaskExpand from '../components/planTaskExpand';
const wbs  = () => import('../manage/wbs1');
export default {
  components: {
    modelTable,
    outsideDialog,
    wbs,
    taskDialog,
    planTaskDialog,
    planTaskExpand
  },
  computed: {
    ...mapState({
      tableConfig: (state) => {
        let projectManager = state.ISDPOld.project.projectManager;
        let config = JSON.parse(JSON.stringify(taskConfig.tableConfig || {}));
        if(!projectManager){
          config.columns.pop();
          config.columns.pop();
        }

        return config || [];
      },
      projectModel: (state) => {
        const { detailData } = state.ISDPOld.project || {};
        const {projectModel } = detailData && detailData.data || {}
        return projectModel;
      },
      approvalList: (state) =>state.ISDPOld.project.approvalList || []
    })
  },
  data() {
    return {
      taskData: [],
      approvalConfig,
      sessionRow: [],
      taskDialogParams: undefined,
      taskConfig,
      currentTaskFeedback: {},
      taskFeedbackDialogShow: false,
      expandData: {},
      alertSave: false,
      tableActions: {
        deviation(value){
          return +value > 0 ? `延后${ value }天` :  +value < 0 &&  `提前${ Math.abs(+value) }天` || value;
        }
      }
    };
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    beforeClose(){
      this.taskFeedbackDialogShow = false;
    },
    updateList(){
      this.getTaskList();
    },
    changeSaveStatus(status) {
      this.alertSave = status;
    },
    async getApprovalList(formType = 3){
      const { id } = this.$route.query;
      if(!id){
        return false;
      }
      await this.$store.dispatch('ISDPOld/project/getApprovalList',{projectId: id, formType});
    },
    // 查询任务列表接口
    async getTaskList() {
      this.taskData = [];
      const { data = {} } = await this.$store.dispatch('ISDPOld/project/getTaskList', {
        argsMap: {
          projectId: this.$route.query.id
        },
        pageCount: 10,
        pageNum: 1
      });
      this.taskData = data.content && data.content.map((item,index) => {
        item.index = ++index;
        if(item.taskStatus && item.taskStatus.includes('完成')){
          item.switch = 'ON';
          item.disabled = true;
          item.icons = [];
        }else{
          item.switch = 'OFF';
          item.disabled = +item.taskProgress !== 100;
        }
        return item;
      });
    },
    handleClickForFold(row) {
      row._active = !row._active;
      let idx = this.sessionRow.findIndex((item) => item === row.childrenId);
      if (idx < 0) {
        this.sessionRow.push(row.childrenId);
      } else {
        this.sessionRow.splice(idx, 1);
      }
    },
    async handleChangeForSwitch(row,val,opts){
      row[opts.prop] = 'OFF';
      this.$confirm('是否确认该任务完成?','提示',{
        callback: async (action) => {
          if(action === 'confirm'){
            let { resultCode = '' }  = await this.$store.dispatch('ISDP/project/taskCompleteConfirm',{
              id: row.id
            });
            if(resultCode === 'TS202' || resultCode.includes('200')){
              this.$elMessage({
                message: '操作成功!',
                type: 'success'
              });
            }
            this.$refs.wbs.getList();
            this.getTaskList();
          }
        }
      })

    },
    //
    // task dialog start
    //
    dialogFeedback(data,args){
      this.taskDialogParams = args;
    },
    //
    // task dialog end
    //
    async handleChangeForExpand(row){ // expandRow
      // if(row.expand){
      //   return false;
      // }
      let {data = {} } = await this.$store.dispatch('ISDPOld/project/getQueryList',{
        argsMap: {
          taskFormId: row.id,
          sort: 'DESC'
        },
        pageCount: 5,
        pageNum: 1
      });

      let obj = {};
      obj[row.id] = data.content || [];

      this.expandData = Object.assign({},this.expandData,obj);
    },
    async handleDBLClickForExpandItem(args){
      let {data} = await this.$store.dispatch('ISDPOld/project/getTaskFeedbackDetail',{
        id: args.id
      });
      this.currentTaskFeedback = data || {};
      this.taskFeedbackDialogShow = true;
    }
  },
  async created() {
    this.getApprovalList(3);
    await this.getTaskList();
  },
  beforeRouteLeave(to, from, next) {
    if(this.alertSave) {
      this.$elMessage({
        type: 'error',
        message: '请先保存当前页面信息'
      })
      return ;
    }
    next();
  }
};
</script>
<style lang="less">
  .project-detail-plan {
    .txt {
      position: relative;
      z-index: 1;
      line-height: 42px;
      margin-top: 30px;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      display: flex;
      span {
        &:first-child {
          position: relative;
          z-index: 3;
          padding: 0 15px;
          background: #fff;
        }
        &:last-child {
          position: absolute;
          top: 50%;
          width: 100%;
          display: block;
          height: 1px;
          z-index: 2;
          background: #ddd;
        }
      }
    }
  }
</style>
