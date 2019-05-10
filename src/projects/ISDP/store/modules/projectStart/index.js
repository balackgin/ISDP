/*
 * @Author: xia_wenxing/90111
 * @Date: 2019-04-15 15:47:50
 * @Last Modified by: xia_wenxing/90111
 * @Last Modified time: 2019-04-30 19:35:15
 */
import api from '@ISDP/api/projectStart';
import wbs from './wbs';
export default {
  namespaced: true,
  modules: {
    wbs
  },
  actions: {
    getProjectStartTree(store, params) {
      const data = api.getProjectStartTree(params);
      return data;
    },
    getProjectStartPeopleTree(store, params) {
      const data = api.getProjectStartPeopleTree(params);
      return data;
    },
    projectModelConfirm(store, params) {
      return api.projectModelConfirm(params);
    },
    projectModelModifyApply(store, params) {
      return api.projectModelModifyApply(params);
    },
    getApprovalUrl(store, params) {
      return api.getApprovalUrl(params);
    },
    treeSave(store, params) {
      const data = api.treeSave(params);
      return data;
    },
    treeDel(store, params) {
      const data = api.treeDel(params);
      return data;
    },
    setProjectDesc(store, params) {
      return api.setProjectDesc(params);
    },
    getTeamTreeExport(store, params) {
      const data = api.getTeamTreeExport(params);
      return data;
    }
  }
};