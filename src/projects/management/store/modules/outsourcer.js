import api from '../../api/outsourcer';
export default {
  namespaced: true,
  state: {},
  mutations: {},
  actions: {
    getOutsourcerApply(store, params) {
      return api.getOutsourcerApply(params);
    },
    getOutsourcerLibrary(store, params) {
      return api.getOutsourcerLibrary(params);
    },
    getApprovalList(store, params) {
      return api.getApprovalList(params);
    },
    approvalConfirm(store, params) {
      return api.approvalConfirm(params);
    },
    getApprovalUrl(store, params) {
      return api.getApprovalUrl(params);
    },
    approvalFinish(store, params) {
      return api.approvalFinish(params);
    }
  }
};
