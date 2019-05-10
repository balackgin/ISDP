import api from '@/api/user';
export default {
  namespaced: true,
  actions: {
    login(store, params) {
      return api.login(params);
    },
    register(store, params) {
      return api.register(params);
    },
    getAuthCode(store, params) {
      return api.getAuthCode(params);
    },
    setNewPassword(store, params) {
      return api.setNewPassword(params);
    },
    getEmployeeInfo(store, params) {
      return api.getEmployeeInfo(params);
    }
  }
};