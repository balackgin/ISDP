// projectStart
import fetch from '@/utils/fetch';

const urlStr = '/easywork/api/platform';
//获取团队成员模板
export default {
  getProjectStartTree(args) {
    return fetch({
      url: urlStr + '/role/tree/query',
      method: 'post',
      data: args
    });
  },
  // 获取团队成员树形结构
  getProjectStartPeopleTree(args) {
    return fetch({
      url: urlStr + '/team/member/tree/query',
      method: 'post',
      data: args
    });
  },
  //保存
  treeSave(args) {
    return fetch({
      url: urlStr + '/team/member/save',
      method: 'post',
      data: args
    });
  },
  treeDel(args) {
    return fetch({
      url: urlStr + '/team/member/del',
      method: 'post',
      data: args
    });
  },
  /**
   *  项目经理确认项目模式
   *
   * @param {*} args
   * id
   * @returns
   */
  projectModelConfirm(args) {
    return fetch({
      url: '/easywork/api/project/projectManager/projectModel/confirm',
      method: 'post',
      data: args
    });
  },

  /**
   * 项目模式变更申请
   *
   * @param {*} args
   * id
   * projectModel
   * approvalForm: {
   *  serialNo,
   * applicationCompany,
   * formType,
   * applicant,
   * applicantTel,
   * applicantReason
   * }
   * @returns
   */
  projectModelModifyApply(args) {
    return fetch({
      url: '/easywork/api/project/projectManager/projectModel/modifyApply',
      method: 'post',
      data: args
    });
  },

  /**
   * 获取审批流程URL
   *
   * @param {*} args
   * formType:  1项目变更；2里程碑计划；3wbs计划；4项目交底；0外包商
   * projectId
   * @returns
   */
  getApprovalUrl(args) {
    return fetch({
      url: urlStr + '/approval/url',
      method: 'post',
      data: args,
      showMessage: false
    });
  },
  ///team/member/tree/query

  /**
   *  编辑项目描述
   *
   * @param {*} args
   * id: 项目ID
   * projectDesc: 项目描述内容
   * @returns
   */
  setProjectDesc(args) {
    return fetch({
      url: '/easywork/api/project/projectInfo/saveProjectDesc',
      method: 'post',
      data: args
    });
  },
  //导出 团队xlsx
  getTeamTreeExport(args) {
    return fetch({
      url: urlStr + '/team/member/export',
      method: 'post',
      data: args,
      responseType: 'blob'
    });
  }
};