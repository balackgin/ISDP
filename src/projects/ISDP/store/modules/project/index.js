import api from '@/projects/ISDP/api/project';
import projectConfigure from './projectConfigre';
import treeData from '@ISDPOld/views/project/list/demo/config/demo.config.json';
const project = {
  namespaced: true,
  modules: {
    projectConfigure
  },
  state: {
    treeParams: {},
    treeNode: {},
    treeData: treeData.demo,
    projectDefaultID: null,
    projectId: null,
    detailData: null
  },
  getters: {},
  mutations: {
    SET_TREE_PARAMS(state, params) {
      state.treeParams = params;
    },
    SET_TREE_NODE(state, data) {
      state.treeNode = data;
    },
    SET_PROJECT_DEFAULT_ID(state, data) {
      state.projectDefaultID = data;
    },
    SET_PROJECT_ID(state, data) {
      state.projectId = data;
    },
    SET_DETAIL_DATA(state, data) {
      state.detailData = data;
    }
  },
  actions: {
    setTreeParams(store, params) {
      store.commit('SET_TREE_PARAMS', params);
    },
    setTreeNode(store, params) {
      store.commit('SET_TREE_NODE', params);
    },
    getProjectAllList(store, params) {
      const data = api.getProjectAllList(params);
      return data;
    },
    getStatisticsLevel(store, params) {
      const data = api.getStatisticsLevel(params);
      return data;
    },
    getStatisticsDeliver(store, params) {
      const data = api.getStatisticsDeliver(params);
      return data;
    },
    getEmplyees(store, params) {
      const data = api.getEmplyees(params);
      return data;
    },
    getProjectManager(store, params) {
      const data = api.getProjectManager(params);
      return data;
    },
    async getProjectForDefault(store, params = {}) {
      const { data = {} } = await api.getProjectForDefault(params);
      store.commit('SET_PROJECT_DEFAULT_ID', data.businessId);
      return data;
    },
    async saveProjectForDefault(store, params = {}) {
      const response = await api.saveProjectForDefault(params);
      +response.resultCode === 200 &&
        store.commit('SET_PROJECT_DEFAULT_ID', params.businessId);
      return response;
    },
    async getProjectDetail(store, params) {
      const response = await api.getProjectDetail(params);
      store.commit('SET_DETAIL_DATA', response.data);
      return response;
    },
    getProjectTask(store, params) {
      return api.getProjectTask(params);
    },
    getCost(store, params) {
      return api.getCost(params);
    },
    getRiskProblem(store, params) {
      return api.getRiskProblem(params);
    },
    exportProjectReport(store, params) {
      return api.exportProjectReport(params);
    },
    exportProjectData(store, params) {
      return api.exportProjectData(params);
    }
  }
};

export default project;
