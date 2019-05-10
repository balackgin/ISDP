import api from '@ISDP/api/progressManage/externalField';
export default {
  actions: {
    //外场实施子计划获取列表
    getChildPlanList(store, params) {
      const data = api.getChildPlanList(params);
      return data;
    },
    getChildPlanReleaseList(store, params) {
      const data = api.getChildPlanReleaseList(params);
      return data;
    },
    //导出excel
    exportChildPlanExcel(store, params) {
      const data = api.exportChildPlanExcel(params);
      return data;
    },
    //导入excel
    importChildPlanExcel(store, params) {
      const data = api.importChildPlanExcel(params);
      return data;
    },
    //发布
    issueChildPlan(store, params) {
      const data = api.issueChildPlan(params);
      return data;
    },
    //派发前校验
    validateDistribute(store, params) {
      const data = api.validateDistribute(params);
      return data;
    },
    //派发
    distributeChildPlan(store, params) {
      const data = api.distributeChildPlan(params);
      return data;
    },
    //外场实施子计划接受及反馈
    feedbackChildPlan(store, params) {
      const data = api.feedbackChildPlan(params);
      return data;
    },
    //人员查询
    queryChildPlanPerson(store, params) {
      const data = api.queryChildPlanPerson(params);
      return data;
    }
  }
}