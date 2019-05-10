import api from '@/projects/outsourcer/api/project';
export default {
  namespaced: true,
  actions: {
    list(store, params) {
      return api.list(params);
    }
  }
};
