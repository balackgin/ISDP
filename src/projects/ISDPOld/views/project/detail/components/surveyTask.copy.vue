<template>
  <div class="task-w">
    <div class="task-wrap">
      <ul class="task-list ">
        <div class="milepost-title detail-title-wrap">
          <p class="d-inline-block txt">
            <span>待办</span>
            <span class="fas fa-angle-double-down"></span>
            <span class="task-normal">{{taskList && (taskList.length - taskAlert.length)}}</span>
            <span class="task-alert">{{taskList && taskAlert.length}}</span>
          </p>
          <!-- <p class="warn-box"></p> -->
        </div>
        <li v-for="(item, index) of taskList"
            :key="index">

          <router-link class="text"
                       :to="`/ISDP/project/detail/plan?type=task&taskId=${item.id}&id=${$route.query.id}`">
            <span class="icon"
                  :class="item.overdue ? 'danger': ''">{{item.overdue? '超期' : '正常'}}</span>
            <span class="txt ml-1 spe">{{item.taskName}}</span>
            <span class="txt ml-1 right">{{item.planEndDate&&item.planEndDate}}</span>
            <span class="txt ml-1 right">{{item.recieverName}}</span>

          </router-link>
        </li>
      </ul>
      <ul class="task-list">
        <div class="milepost-title detail-title-wrap">
          <span class="txt">提醒</span>
        </div>
        <li v-for="(item, index) of taskAlert"
            :key="index">
          <router-link class="text"
                       :to="`/ISDP/project/detail/plan?type=task&taskId=${item.id}&id=${$route.query.id}`">
            <span class="icon"
                  :class="item.overdue ? 'danger': ''">{{item.overdue? '超期' : '将要超期'}}</span>
            <span class="txt ml-1 spe">{{item.taskName}}</span>
            <span class="txt ml-1 right">{{item.planEndDate&&item.planEndDate}}</span>
            <span class="txt ml-1 right">{{item.recieverName}}</span>
          </router-link>
        </li>
      </ul>
    </div>

  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      taskList: [],
      taskAlert: [],
      taskName: '',
      taskContent: '',
      version: '',
      taskStatus: '',
      planEndDate: '',
      feedbackRule: '',
      formEdit: {
        progress: '',
        time: '',
        detail: ''
      },
      tableData: [],
      options: [ {
        value: 1,
        label: 1
      },
      {
        value: 2,
        label: 2
      } ],
      options2: [ {
        value: '是',
        label: '是'
      },
      {
        value: '否',
        label: '否'
      } ],
      support: '',
      handleForm: false
    }
  },
  methods: {
    // 渲染反馈列表
    async getQueryList(){
      const { data } = await this.$store.dispatch('ISDPOld/project/getQueryList', {

        argsMap: {
          taskFormId: 1
        },
        pageCount: 5,
        pageNum: 1
      })
      // console.log(data.content);
      if(data) {
        this.tableData = data.content;
      }
    },
    async getTaskList(name, params) {
      const { data } = await this.$store.dispatch('ISDPOld/project/getTaskList', {
        argsMap: {
          ...params,
          projectId: this.$route.query.id
        },
        pageCount: 10,
        pageNum: 1
      });
      if (data) {
        this[name] = data.content;
      }
    }
  },
  created(){
    this.getTaskList('taskList');
    this.getTaskList('taskAlert', { alert: -3 });
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
        width: 50%;
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
      margin-top: 40px;
      border: 1px solid #cccccc;
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
    .button-add {
      font-size: 24px;
      padding: 0;
      color: #d50000;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      font-weight: 700;
      margin-left: 70px;
      &:hover {
        background-color: #ffc5c5;
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
