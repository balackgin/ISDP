import selects from './selects';
import api from '@/projects/outsourcer/api/common';
const common = {
  namespaced: true,
  state: {
    selects,
    outsourcerInfo: null
  },
  mutations: {
    SET_OUTSOURCERINFO(state, data) {
      state.outsourcerInfo = data;
    }
  },
  actions: {
    async getOutsourcerInfo(store, params) {
      let { data } = await api.getOutsourcerInfo(params);
      store.commit('SET_OUTSOURCERINFO', data || {});
    }
  }
};

export default common;
