import api from '@/projects/sys/api/sys';
const sys = {
  namespaced: true,
  state: {},
  getter: {},
  mutations: {},
  actions: {
    async getRoleList(store, params) {
      let data = await api.getRoleList(params);
      return data;
    },
    async getRoleMember(store, params) {
      let data = await api.getRoleMember(params);
      return data;
    },
    async addRoleMember(store, params) {
      let data = await api.addRoleMember(params);
      return data;
    },
    async deleteRoleMember(store, params) {
      let data = await api.deleteRoleMember(params);
      return data;
    },
    async deleteRole(store, params) {
      let data = await api.deleteRole(params);
      return data;
    },
    async addRole(store, params) {
      let data = await api.addRole(params);
      return data;
    }
  }
};

export default sys;