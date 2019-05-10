/*
 * @Author: xia_wenxing/90111
 * @Date: 2019-04-15 15:47:50
 * @Last Modified by: xia_wenxing/90111
 * @Last Modified time: 2019-04-30 08:49:02
 */

import api from '@ISDP/api/projectStart/wbs';
export default {
  namespaced: true,
  actions: {
    maintainState(store, params) {
      return api.maintainState(params);
    },
    getMaintainForAlone(store, params) {
      return api.getMaintainForAlone(params);
    },
    getMaintainForMore(store, params) {
      return api.getMaintainForMore(params);
    },
    distributePlan(store, params) {
      return api.distributePlan(params);
    },
    closePlan(store, params) {
      return api.closePlan(params);
    },
    issuePlan(store, params) {
      return api.issuePlan(params);
    },
    acceptPlan(store, params) {
      return api.acceptPlan(params);
    },
    forwardPlan(store, params) {
      return api.forwardPlan(params);
    },
    getSubTaskDetail(store, params) {
      return api.getSubTaskDetail(params);
    },
    reSubTask(store, params) {
      return api.reSubTask(params);
    },
    feedbackSubTask(store, params) {
      return api.feedbackSubTask(params);
    },
    recallPlan(store, params) {
      return api.recallPlan(params);
    },
    wbsMaintainStateDownload(store, params) {
      return api.wbsMaintainStateDownload(params);
    },
    downloadTemplate(store, params) {
      return api.downloadTemplate(params);
    },
    saveDeliverable(store, params) {
      return api.saveDeliverable(params);
    },
    wbsMaintainSavePlan(store, params) {
      return api.wbsMaintainSavePlan(params);
    },
    getMyTaskList(store, params) {
      return api.getMyTaskList(params);
    },
    wbsMaintainReject(store, params) {
      return api.wbsMaintainReject(params);
    },
    saveNewDeliverable(store, params) {
      return api.saveNewDeliverable(params);
    },
    deleteDeliverable(store, params) {
      return api.deleteDeliverable(params);
    }
  }
};