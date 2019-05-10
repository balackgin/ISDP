import budget from './budget';
import api from '@ISDP/api/operationManage';
export default {
  namespaced: true,
  modules: {
    budget
  },
  actions: {
    getRiskproblemList(store, params) {
      const data = api.getRiskproblemList(params);
      return data;
    },
    saveRiskproblem(store, params) {
      const data = api.saveRiskproblem(params);
      return data;
    },
    getRiskDetail(store, params) {
      const data = api.getRiskDetail(params);
      return data;
    },
    riskSave(store, params) {
      const data = api.riskSave(params);
      return data;
    },
    releaseRisk(store, params) {
      const data = api.releaseRisk(params);
      return data;
    },
    defeatRisk(store, params) {
      const data = api.defeatRisk(params);
      return data;
    },
    closedRisk(store, params) {
      const data = api.closedRisk(params);
      return data;
    },
    sendBackRisk(store, params) {
      const data = api.sendBackRisk(params);
      return data;
    },
    getMember(store, params) {
      const data = api.getMember(params);
      return data;
    },
    downexcel(store, params) {
      const data = api.downexcel(params);
      return data;
    },
    sendTask(store, params) {
      const data = api.sendTask(params);
      return data;
    },
    hangRisk(store, params) {
      const data = api.hangRisk(params);
      return data;
    }
  }
};
