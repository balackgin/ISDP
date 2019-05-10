import api from '@/projects/ISDP/api/configure';
const project = {
  namespaced: true,
  mutations: {},
  getters: {},
  state: {},
  actions: {
    // 公共配置 >> 权限配置
    getRoleList(store, params) {
      const data = api.getRoleList(params);
      return data;
    },
    saveRoles(store, params) {
      const data = api.saveRoles(params);
      return data;
    },
    deleteRole(store, params) {
      const data = api.deleteRole(params);
      return data;
    },
    getElements(store, params) {
      const data = api.getElements(params);
      return data;
    },
    saveElement(store, params) {
      const data = api.saveElement(params);
      return data;
    },
    getMemberList(store, params) {
      const data = api.getMemberList(params);
      return data;
    },
    deleteMember(store, params) {
      const data = api.deleteMember(params);
      return data;
    },
    saveMember(store, params) {
      const data = api.saveMember(params);
      return data;
    },
    //公共配置 wbs设置
    getProjectGroupList(store, params) {
      const data = api.getProjectGroupList(params);
      return data;
    },
    getDetailJobTemplate(store, params) {
      const data = api.getDetailJobTemplate(params);
      return data;
    },
    saveDeliverableTemplate(store, params) {
      const data = api.saveDeliverableTemplate(params);
      return data;
    },
    deleteDeliverableTemplate(store, params) {
      const data = api.deleteDeliverableTemplate(params);
      return data;
    },
    issueJobTemplate(store, params) {
      const data = api.issueJobTemplate(params);
      return data;
    },
    deleteAttachment(store, params) {
      const data = api.deleteAttachment(params);
      return data;
    },
    //里程碑设置
    getMilepostListQuery(store, params) {
      const data = api.getMilepostListQuery(params);
      return data;
    },
    gitMilepostWbsOptList(store, params) {
      const data = api.gitMilepostWbsOptList(params);
      return data;
    },
    gitMilepostOptList(store, params) {
      const data = api.gitMilepostOptList(params);
      return data;
    },
    saveMilepost(store, params) {
      const data = api.saveMilepost(params);
      return data;
    }
  }
};

export default project;