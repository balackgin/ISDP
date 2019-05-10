/*
 * @Author: xia_wenxing/90111
 * @Date: 2019-04-15 15:47:33
 * @Last Modified by: xia_wenxing/90111
 * @Last Modified time: 2019-04-30 08:49:44
 */
// wbs管理
import fetch from '@/utils/fetch';
const apiPath = '/easywork/api/project/planNote/maintainState';
// const apiPath = '/planNote/maintainState';
export default {
  /**
   * WBS维护
   *
   * @param {*} args
   * projectId: 项目ID
   * projectModule
   * @returns
   */
  maintainState(args) {
    return fetch({
      url: `${ apiPath }`,
      method: 'post',
      data: args
    });
  },

  /**
   * WBS维护》查询列表
   *
   * @param {*} args
   * projectId: 项目ID
   * projectModule
   * @returns
   */
  getMaintainForAlone(args) {
    return fetch({
      url: `${ apiPath }/querylist`,
      method: 'post',
      data: args
    });
  },
  /**
   * WBS任务》 添加交付件上传
   *
   * @param {*} args
   * @returns
   */
  saveNewDeliverable(args) {
    return fetch({
      url: `${ apiPath }/saveNewDeliverable`,
      method: 'post',
      data: args
    });
  },
  /**
   * WBS任务》 添加交付件上传
   *
   * @param {*} args
   * @returns
   */
  deleteDeliverable(args) {
    return fetch({
      url: `${ apiPath }/deleteDeliverable`,
      method: 'post',
      data: args
    });
  },
  /**
   * WBS任务》查询我的列表
   *
   * @param {*} args
   * projectId: 项目ID
   * projectModule
   * @returns
   */
  getMyTaskList(args) {
    return fetch({
      url: `${ apiPath }/queryMyTasks`,
      method: 'post',
      data: args
    });
  },
  /**
   * WBS维护》分页查询
   *
   * @param {*} args
   * pageNum: 当前页
   * pageCount: 每页条数
   * obj: {
   *  projectId: 项目ID
   * }
   * @returns
   * // planStatus
      // UNALLOCATED("0", "未派发"),
      // ALLOCATED("1", "已派发"),
      // ACCEPTED("2", "已接受"),
      // FEEDBACK("5", "已反馈"),
      // COMPLETED("6", "已完成");
   */
  getMaintainForMore(args) {
    return fetch({
      url: `${ apiPath }/queryPage`,
      method: 'post',
      data: args
    });
  },

  /**
   *  派发计划
   *
   * @param {*} args
   * id: 数据项ID
   * @returns
   */
  distributePlan(args) {
    return fetch({
      url: `${ apiPath }/distributePlan`,
      method: 'post',
      data: args
    });
  },

  /**
   * 关闭计划
   *
   * @param {*} args
   * id: 数据项ID
   * @returns
   */
  closePlan(args) {
    return fetch({
      url: `${ apiPath }/closePlan`,
      method: 'post',
      data: args
    });
  },

  /**
   * 发布计划
   *
   * @param {*} args
   * id: 项目ID
   * @returns
   */
  issuePlan(args) {
    return fetch({
      url: `${ apiPath }/issuePlan`,
      method: 'post',
      data: args
    });
  },
  /**
   * 接受计划
   *
   * @param {*} args
   * id
   * @returns
   */
  acceptPlan(args) {
    return fetch({
      url: `${ apiPath }/acceptPlan`,
      method: 'post',
      data: args
    });
  },

  /**
   * 转发计划
   *
   * @param {*} args
   * id: 项目ID
   * dutyPersonNo: 计划责任人工号
   * dutyPersonName: 计划责任人姓名
   * @returns
   */
  recallPlan(args) {
    return fetch({
      url: `${ apiPath }/recallPlan`,
      method: 'post',
      data: args
    });
  },

  /**
   * 召回计划
   *
   * @param {*} args
   * id: 任务id
   * @returns
   */
  forwardPlan(args) {
    return fetch({
      url: `${ apiPath }/forwardPlan`,
      method: 'post',
      data: args
    });
  },
  /**
   * WBS维护》子任务详情
   *
   * @param {*} args
   * id
   * @returns
   */
  getSubTaskDetail(args) {
    return fetch({
      url: `${ apiPath }/detail`,
      method: 'post',
      data: args
    });
  },

  /**
   * 退回子任务
   *
   * @param {*} args
   * id
   * @returns
   */
  reSubTask(args) {
    return fetch({
      url: `${ apiPath }/backPlan`,
      method: 'post',
      data: args
    });
  },

  /**
   * 反馈子任务 (完成后提交项目经理审核关闭)
   *
   * @param {*} args
   * id
   * @returns
   */
  feedbackSubTask(args) {
    return fetch({
      url: `${ apiPath }/feedbackPlan`,
      method: 'post',
      data: args
    });
  },
  /**
   * 保存交付件
   *
   * @param {*} args
   */
  saveDeliverable(args) {
    return fetch({
      url: `${ apiPath }/saveDeliverable`,
      method: 'post',
      data: args
    });
  },
  wbsMaintainSavePlan(args) {
    return fetch({
      url: `${ apiPath }/savePlan`,
      method: 'post',
      data: args
    });
  },

  /**
   *  下载模板
   *
   * @param {*} args
   * projectId
   * @returns
   */
  wbsMaintainStateDownload(args) {
    return fetch({
      url: `${ apiPath }/exportByProjectId`,
      method: 'post',
      data: args,
      responseType: 'blob'
    });
  },

  /**
   * 导入模板 暂不使用
   *
   * @param {*} args
   * projectId
   * excel: excel文件
   * @returns
   */
  wbsMaintainStateImport(args) {
    return fetch({
      url: `${ apiPath }/importExcel`,
      method: 'post',
      data: args
    });
  },
  /**
   * 交付件模板下载
   *
   * @param {*} args
   */
  downloadTemplate(args) {
    return fetch({
      url: '/easywork/api/platform/file/query',
      method: 'post',
      data: args
    });
  },

  /**
   * wbs维护驳回关闭
   *
   * @param {*} args
   * id: wbs维护单项ID
   * @returns
   */
  wbsMaintainReject(args) {
    return fetch({
      url: '/easywork/api/project/planNote/maintainState/rejectPlan',
      method: 'post',
      data: args
    });
  }
};