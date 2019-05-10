import api from '@ISDP/api/progressManage';
import externalField from './externalField';
export default {
  namespaced: true,
  modules: {
    externalField
  },
  actions: {
    getOutfieldConstructionChart(store, params) {
      return api.getOutfieldConstructionChart(params);
    }
  }
};
