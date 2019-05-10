import fetch from '@/utils/fetch';
export default {
  /**
   * 用户信息获取（用户名，昵称，用户组，角色，菜单）
   *
   * @param {*} args
   * @returns
   */
  getUserInfo(args) {
    return fetch({
      url: '/easywork/api/auth/querypermission',
      method: 'post',
      data: args,
      showMessage: false,
      loading: false
    });
  },

  /**
   * 获取审批流程URL
   *
   * @param {*} args
   * formType   1项目变更；2里程碑计划；3wbs计划；4项目交底；0外包商
   * projectId: 项目id
   * @returns
   */
  getApproval(args) {
    return fetch({
      url: '/easywork/api/platform/approval/url',
      method: 'post',
      data: args,
      showMessage: false
    });
  },

  /**
   *  根据审批单ID，获取项目ID及其他重要信息
   *
   * @param {*} args
   * approvalId: 审批单ID
   * @returns
   * // formType:
      // 外包商管理 :0     // managementOutsourcerDetail
      // 项目模式变更：1    // routeConfig.projectContract  query: approval/1
      // 里程碑计划：2     //routeConfig.projectManage
      // wbs计划：3       //routeConfig.projectPlan
      // 项目交底：4      //routeConfig.projectContract   query: disclose/2
   */
  getProjectForApproval(args) {
    return fetch({
      url: '/easywork/api/platform/page/param',
      method: 'post',
      data: args
    });
  },
  /**
   *
   *
   * @param {*}
   * url: 链接
   * args: 参数
   * @returns
   */
  download(url, args) {
    return fetch({
      url,
      method: 'get',
      params: args,
      responseType: 'blob'
    });
  }
};
