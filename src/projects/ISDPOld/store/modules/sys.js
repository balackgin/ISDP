import api from '@/projects/ISDPOld/api/sys';
const sys = {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    async saveCodeClassify(store, params) {
      let data = await api.saveCodeClassify(params);
      return data;
    },
    async queryCodeArray(store, params) {
      let data = await api.queryCodeArray(params);
      return data;
    },
    async queryAllCodeClassify(store, params) {
      let data = await api.queryAllCodeClassify(params);
      return data;
    }
  }
};

export default sys;