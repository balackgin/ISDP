import api from '@ISDP/api/operationManage/budget';
export default {
  namespaced: true,
  actions: {
    getBudgetList(store, params) {
      return api.getBudgetList(params);
    },
    publishBudget(store, params) {
      return api.publishBudget(params);
    },
    exportBudget(store, params) {
      return api.exportBudget(params);
    }
  }
};
