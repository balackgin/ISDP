import fetch from '@/utils/fetch';

export default {
  /**
   *  外包商列表   //审批状态: 未完成
   *
   * @param {*} args
   * @returns
   */
  getOutsourcerApply(args) {
    return fetch({
      url: '/easywork/api/contractor/querycontractorlist',
      method: 'post',
      data: args
    });
  },

  /**
   *  审批完成外包商列表  //审批状态: 已完成
   *
   * @param {*} args
   * @returns
   */
  getOutsourcerLibrary(args) {
    return fetch({
      url: '/easywork/api/contractor/querycontractordone',
      method: 'post',
      data: args
    });
  },

  /**
   *  审批单所有审批记录
   *
   * @param {*} args
   * contractorId: 外包商ID
   * @returns
   */
  getApprovalList(args) {
    return fetch({
      url: '/easywork/api/platform/approval/record',
      method: 'post',
      data: args,
      showMessage: false
    });
  },

  /**
   * 外包商审批确认
   *
   * @param {*} args
   * contractorId:  外包商ID
   * idea:          审批意见
   * result:        0通过，1不通过
   * @returns
   */
  approvalConfirm(args) {
    return fetch({
      url: '/easywork/api/platform/approval/confirm',
      method: 'post',
      data: args
    });
  },

  /**
   * 外包商管理平台获取工作流链接
   *
   * @param {contractorId} args
   * contractorId: 外包商ID
   * @returns
   */
  getApprovalUrl(args) {
    return fetch({
      url: '/easywork/api/platform/contractor/approval/url',
      method: 'post',
      data: args
    });
  },

  /**
   * 外包商审批结束回调参数 更新外包商认证级别/类型
   *
   * @param {*} args
   * contractorId: 外包商ID
   * identification:  认证类别
   * classify:  认证级别
   * @returns
   */
  approvalFinish(args) {
    return fetch({
      url: '/easywork/api/contractor/addidentification',
      method: 'post',
      data: args,
      showMessage: false
    });
  }
};
