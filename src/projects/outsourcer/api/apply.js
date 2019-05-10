import fetch from '@/utils/fetch';
export default {
  /**
   * 外包商纳入申请保存
   *
   * @param {*} args
   * http://10.1.248.147:8080/eolinker_os/index.html#/home/project/inside/api/detail?groupID=4&apiID=10&projectName=%E9%9B%86%E6%88%90%E4%BA%A4%E4%BB%98%E4%B8%80%E7%AB%99%E5%BC%8F%E5%B9%B3%E5%8F%B0&projectId=2
   * @returns
   */
  approvalSave(args) {
    return fetch({
      url: '/easywork/api/contractor/approval/save',
      method: 'post',
      data: args
    });
  },

  /**
   *  外包商纳入申请提交
   *
   * @param {*} args
   * businessId: 外包商ID
   * applicationCompany: 申请单位
   * applicant: 申请人
   * applicantTel: 申请人电话
   * @returns
   */
  approvalSubmit(args) {
    return fetch({
      url: '/easywork/api/platform/approval/commit',
      method: 'post',
      data: args
    });
  },

  /**
   * 外包商详细信息
   *
   * @param {*} args
   * id: 外包商id
   * @returns
   * notCommit   未提交  approving 审批中    notPass 不通过    finished  审批完成
   */
  getDetail(args) {
    return fetch({
      url: '/easywork/api/contractor/detail',
      method: 'post',
      data: args
    });
  },

  /**
   * 资质证书列表
   *
   * @param {*} args
   * id: 外包商id
   * @returns
   */
  getQualificationsList(args) {
    return fetch({
      url: '/easywork/api/contractor/certificate',
      method: 'post',
      data: args
    });
  },
  /**
   * 人员列表
   *
   * @param {*} args
   * id: 外包商id
   * @returns
   */
  getPersonnelList(args) {
    return fetch({
      url: '/easywork/api/contractor/staff',
      method: 'post',
      data: args
    });
  },

  /**
   * 车辆详情列表
   *
   * @param {*} args
   * id: 外包商id
   * @returns
   */
  getVehicleList(args) {
    return fetch({
      url: '/easywork/api/contractor/vehicle',
      method: 'post',
      data: args
    });
  },

  /**
   * 业绩详情列表
   *
   * @param {*} args
   * id: 外包商id
   * @returns
   */
  getAchievementList(args) {
    return fetch({
      url: '/easywork/api/contractor/achievement',
      method: 'post',
      data: args
    });
  }
};
