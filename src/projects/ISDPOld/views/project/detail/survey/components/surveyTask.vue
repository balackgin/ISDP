<template>
  <div class="task-w">
    <div class="task-wrap">
      <ul class="task-list ">
        <div class="milepost-title detail-title-wrap">
          <p class="d-inline-block txt">
            <span>任务</span>
            <span class="fas fa-angle-double-down"></span>
            <span class="task-normal">{{taskList && (taskList.length - taskAlert.length)}}</span>
            <span class="task-alert">{{taskList && taskAlert.length}}</span>
          </p>
        </div>
      </ul>
    </div>
    <div class="table-wrap">
      <model-table :options="Config.table"
                   :data="taskListData"
                   :fns="tableActions"
                   @callback="callback">
        <!-- <template slot="expand"
                  slot-scope="expandScope">
          <plan-task-expand :options="expandScope.rowData"
                            :data="expandData"
                            @callback="callback"></plan-task-expand>
        </template> -->
      </model-table>
      <task-dialog :params.sync="dialogParams"></task-dialog>
      <!-- <plan-task-dialog :show="taskFeedbackDialogShow"
                        :detailData="currentTaskFeedback"
                        @callback="callback"></plan-task-dialog> -->
    </div>
  </div>
</template>
<script>
import modelTable from '@/components/modelList/modelTable';
import Config from './config/survey.task.config';
import taskDialog from './taskDialog';
// import planTaskDialog from './planTaskItemDialog';
// import planTaskExpand from './planTaskExpand';
export default {
  components: {
    modelTable,
    taskDialog
    // planTaskDialog,
    // planTaskExpand
  },
  data() {
    return {
      Config,
      taskListData: [],
      dialogShow: false,
      dialogParams: null,
      // taskFeedbackDialogShow: false,
      // currentTaskFeedback: {},
      // expandData: {},

      tableActions: {
        deviation(value){
          return +value > 0 ? `延后${ value }天` :  +value < 0 &&  `提前${ Math.abs(+value) }天` || value;
        }
      }
    }
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    // 查询任务列表
    async getTaskList(){
      const { username } = this.$store.state.common.userinfo || {};
      const { data = {} } = await this.$store.dispatch('ISDPOld/project/getTaskList', {
        argsMap: {
          projectId: this.$route.query.id,
          receiverNo: username
        },
        pageCount: 5,
        pageNum: 1
      });
      let result = (data.content || []).map((item) => {
        const {deviation,taskStatus} = item;
        item.deviation =  +deviation > 0 ? `延后${ deviation }天` :  +deviation < 0 &&  `提前${ Math.abs(+deviation) }天` || deviation;

        if(taskStatus && taskStatus.includes('完成')){
          item.icons = [];
        }
        return item;
      });
      this.taskListData = result;
    },
    taskFeedback(data,args){
      this.dialogParams = args;
    }
    // async handleChangeForExpand(row){ // expandRow
    //   // if(row.expand){
    //   //   return false;
    //   // }
    //   let {data = {} } = await this.$store.dispatch('ISDPOld/project/getQueryList',{
    //     argsMap: {
    //       taskFormId: row.id
    //     },
    //     pageCount: 5,
    //     pageNum: 1
    //   });

    //   let obj = {};
    //   obj[row.id] = data.content || [];

    //   this.expandData = Object.assign({},this.expandData,obj);
    // },
    // async handleDBLClickForExpandItem(args){
    //   let {data} = await this.$store.dispatch('ISDPOld/project/getTaskFeedbackDetail',{
    //     id: args.id
    //   });
    //   this.currentTaskFeedback = data || {};
    //   this.taskFeedbackDialogShow = true;
    // },
    // beforeClose(){
    //   this.taskFeedbackDialogShow = false;
    // }
  },
  created(){
    this.getTaskList();
  },
  props: {
    taskList: {
      type: Array,
      default(){
        return []
      }
    },
    taskAlert: {
      type: Array,
      default(){
        return []
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .task-w {
    .task-wrap {
      display: flex;
      justify-content: space-between;
      .d-inline-block {
        display: inline-block;
        padding-right: 0 !important;
      }
      .task-list {
        flex: 1;
        .project-detail-wrap .detail-title-wrap {
          overflow: hidden;
        }
        .fas {
          margin-left: 10px;
          font-size: 16px;
          color: #333;
          cursor: pointer;
        }
        // .el-icon-d-arrow-right {
        //   margin-left: 12px;
        //   transform: translateY(2px) rotateZ(90deg);
        //   font-size: 20px;
        //   background: #fff;
        //   &:hover {
        //     cursor: pointer;
        //   }
        // }
        .task-normal {
          margin-left: 12px;
          padding: 2px 8px 2px 10px;
          border-top-left-radius: 10px;
          border-bottom-left-radius: 10px;
          border: 1px solid #ddd;
          text-align: center;
          font-size: 12px;
          font-weight: 500;
          color: #01bcae;
        }
        .task-alert {
          padding: 2px 10px 2px 8px;
          border-top-right-radius: 10px;
          border-bottom-right-radius: 10px;
          border: 1px solid #ddd;
          border-left: none;
          text-align: center;
          font-size: 12px;
          font-weight: 500;
          color: #d50000;
        }
        &:nth-child(1) {
          padding-right: 40px;
        }
        & > .title {
          line-height: 24px;
          margin-top: 12px;
        }
        & > li {
          margin-top: 10px;
          .title {
            margin-bottom: 10px;
            color: #333;
            font-size: 16px;
          }
          .text {
            margin-bottom: 12px;
            .icon {
              padding: 2px 10px;
              line-height: 20px;
              border-radius: 4px;
              background-color: #01bcae;
              vertical-align: top;
              line-height: 20px;
              font-size: 12px;
              font-weight: 700;
              color: #fff;
              &.danger {
                background-color: #d50000;
              }
            }
            .txt {
              display: inline-block;
              height: 20px;
              line-height: 20px;
              color: #000;
              font-size: 14px;
              &.spe {
                display: inline-block;
                width: 60%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              &.right {
                float: right;
              }
            }
          }
          .content {
            margin-left: 80px;
            padding: 4px 14px;
            border-left: 1px solid #ddd;
            color: #333;
            font-size: 12px;
          }
        }
      }
    }
    .table-wrap {
      margin-top: 20px;
    }
    .handle-button {
      font-size: 14px;
      padding: 0;
      color: #d50000;
      border: none;
      &:hover {
        font-weight: 700;
      }
    }

    .el-form-item {
      margin-bottom: 0;
    }
    .handle-label {
      display: block;
      margin-top: 10px;
      width: 115px;
      text-align: center;
    }
  }
</style>
<style lang="less">
  .task-w {
    .el-table__header th,
    el-table__header tr {
      padding: 1px;
      background-color: #eeeeee;
      color: #333333;
      font-size: 12px;
      border-color: #cccccc;
      text-align: center;
    }
    .el-table__body td,
    el-table__body th {
      padding: 1px;
      color: #000000;
      font-size: 14px;
      text-align: center;
      border-color: #cccccc;
    }
    .el-input-item {
      margin: 0;
      padding: 0;
    }
  }
</style>
