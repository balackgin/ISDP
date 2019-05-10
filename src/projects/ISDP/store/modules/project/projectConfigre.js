import api from '@ISDP/api/project/projectConfigure';
export default {
  namespaced: true,
  actions: {
    getPlanConfigure(store, params) {
      return api.getPlanConfigure(params);
    },
    downloadPlanConfigure(store, params) {
      return api.downloadPlanConfigure(params);
    },
    importPlanConfigure(store, params) {
      return api.importPlanConfigure(params);
    },
    savePlan(store, params) {
      return api.savePlan(params);
    }
  }
};
