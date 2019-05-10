import api from '@/projects/ISDP/api/range';
const project = {
  namespaced: true,
  mutations: {},
  getters: {},
  state: {},
  actions: {
    findByPointPositionAndArea(store, params) {
      const data = api.findByPointPositionAndArea(params);
      return data;
    },
    savePoint(store, params) {
      const data = api.savePoint(params);
      return data;
    },
    updatePoint(store, params) {
      const data = api.updatePoint(params);
      return data;
    },
    issuePoint(store, params) {
      const data = api.issuePoint(params);
      return data;
    },
    stopPoint(store, params) {
      const data = api.stopPoint(params);
      return data;
    },
    exportPoint(store, params) {
      const data = api.exportPoint(params);
      return data;
    }
  }
};

export default project;
