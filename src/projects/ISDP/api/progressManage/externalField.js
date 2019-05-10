import fetch from '@/utils/fetch';

const urlStr = '/easywork/api/taskman/outfieldsubplan';
export default {
  /**
   * WBS维护
   *
   * @param {*} args
   * projectId: 项目ID
   * @returns
   */
  //外场实施子计划列表
  getChildPlanList(args) {
    return fetch({
      url: urlStr + '/listPage',
      method: 'post',
      data: args
    });
  },
  //外场实施子计划已派发列表
  getChildPlanReleaseList(args) {
    return fetch({
      url: urlStr + '/listPageIssue',
      method: 'post',
      data: args
    });
  },
  //导出excel
  exportChildPlanExcel(args) {
    return fetch({
      url: '/easywork/api/taskman/outfieldsubplan/export',
      method: 'get',
      params: args,
      responseType: 'blob'
    })
  },
  //导入excel
  importChildPlanExcel(args) {
    return fetch({
      url: urlStr + '/importExcel',
      method: 'post',
      data: args
    });
  },
  //发布
  issueChildPlan(args) {
    return fetch({
      url: urlStr + '/issue',
      method: 'post',
      data: args
    });
  },
  //派发前校验
  validateDistribute(args) {
    return fetch({
      url: urlStr + '/validateDistribute',
      method: 'post',
      data: args,
      showMessage: false
    });
  },
  //派发
  distributeChildPlan(args) {
    return fetch({
      url: urlStr + '/distribute',
      method: 'post',
      data: args
    });
  },
  //外场实施子计划接受及反馈列表
  feedbackChildPlan(args) {
    return fetch({
      url: urlStr + '/listPageFeedback',
      method: 'post',
      data: args
    });

  },
  queryChildPlanPerson(args) {
    return fetch({
      url: '/easywork/api/platform/role/project/members/query',
      method: 'post',
      data: args
    });
  }
}