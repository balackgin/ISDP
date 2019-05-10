<template>
  <div class="project-detail-survey-wrap comm">
    <section class="group">
      <div class="horizontal-list">
        <div class="item">
          <div class="title-wrap flex">
            <div class="flex-item title">
              {{ detailData.contractNo}} <span class="text">{{ detailData.projectName}}</span>
            </div>
            <div class="flex-item text">
              <i class="fas fa-user-tie"></i>
              <span class="username">{{detailData.projectManagerName}}</span>
              <span class="ml-1">{{detailData.projectManagerNo}}</span>
            </div>
          </div>
        </div>
        <!-- <div class="item flex-item">
          <p class="title">{{detailData.data && detailData.data.customerContractNo || ''}}</p>
          <span class="text">{{detailData.data && detailData.data.customer}}</span>
        </div> -->
      </div>
    </section>
    <!-- end of horizontal-list -->

    <section class="group">
      <task-copy v-if="projectManager"
                 :taskList="taskList"
                 :taskAlert="taskAlert"></task-copy>
      <survey-task v-else></survey-task>

    </section>
    <section class="group">
      <survey-risk></survey-risk>
    </section>
    <section class="group"
             v-if="reportPower || projectManager">
      <survey-report :gridData="gridData"></survey-report>
    </section>

    <!-- <section class="group">
      <div class="detail-title-wrap mb-1">
        <span class="txt">WBS计划</span>
      </div>
      <model-table :options="config.tableConfig"
                   @callback="handleCallback"
                   :fns="fns"
                   :data="[]"></model-table>
    </section> -->
    <section class="group"
             v-if="projectModel !== 'SMALL'">
      <survey-milepost>
      </survey-milepost>
    </section>
    <!-- end of milepost-wrap -->
  </div>
</template>
<script>
import { mapState } from 'vuex';
import modelTable from '@/components/modelList/modelTable';
import surveyMilepost from './components/surveyMilepost';
import surveyTask from './components/surveyTask';
import taskCopy from './components/surveyTask.copy';
import surveyReport from './components/surveyReport';
import surveyRisk from './components/surveyRisk';
import config from './config/survey.config';
export default {
  components: {
    modelTable,
    surveyMilepost,
    surveyTask,
    surveyReport,
    surveyRisk,
    taskCopy
  },
  data() {
    return {
      config,
      data: [],
      sessionRow: [],
      taskList: [],
      taskAlert: [],
      gridData: {},
      fns: {
        rowClassName: (row) => {
          if (row.parentId && this.sessionRow.includes(row.parentId)) {
            return 'hide-row';
          } else {
            return 'show-row';
          }
        }
      },
      routeID: '',
      milestoneList: {}
    };
  },
  computed: {
    ...mapState({
      detailData: (state) => {
        let result = state.ISDPOld.project.detailData || {};
        return result.data || {};
      },
      projectManager: (state) => state.ISDPOld.project.projectManager,
      projectModel: (state) => state.ISDPOld.project.projectModel,
      reportPower(state){
        const roleObjAll = state.ISDPOld.project.roleAll || {},
          userinfo = state.common.userinfo || {},
          roleArr = [ ...(roleObjAll.D_SDM || []),...(roleObjAll.D_TD || []) ];
        return roleArr.some((item) => item.staffNo === userinfo.username);
      }
    })
  },
  methods: {
    handleCallback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    handleClickForFold(row) {
      row._active = !row._active;
      let idx = this.sessionRow.findIndex((item) => item === row.childrenId);
      if (idx < 0) {
        this.sessionRow.push(row.childrenId);
      } else {
        this.sessionRow.splice(idx, 1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .project-detail-survey-wrap {
    .group {
      margin-bottom: 24px;
    }
    .horizontal-list {
      .item {
        margin-top: 10px;
        padding: 5px 10px;
        line-height: 1;
        font-size: 16px;
        color: #333;
        border-left: 2px solid #ef4d4d;
        // .title {
        //   // margin-bottom: 4px;
        //   color: #333;
        //   font-size: 16px;
        // }
        .fas {
          margin-right: 4px;
          color: #999;
        }
        .text {
          color: #666;
          font-size: 14px;
        }
      }
    }
    // end of horizontal-list
  }
</style>
