import fetch from '@/utils/fetch';
// import {
//   getApiQuery
// } from '@/utils/getApiQuery';
const urlStr = '/easywork/api/project';
// const urlStr = '';
export default {
  getProjectAllList(args) {
    return fetch({
      url: urlStr + '/list',
      method: 'post',
      data: args
    });
  },
  getStatisticsLevel(args) {
    return fetch({
      url: urlStr + '/projectManager/statisticsLevel',
      method: 'post',
      data: args
    });
  },
  getStatisticsDeliver(args) {
    return fetch({
      url: urlStr + '/projectManager/statisticsDeliver',
      method: 'post',
      data: args
    });
  },
  getEmplyees(args) {
    return fetch({
      url: '/easywork/api/auth/queryemployee',
      method: 'post',
      data: args,
      loading: false
    });
  },
  getProjectManager(args) {
    return fetch({
      url: urlStr + '/projectManager/queryPms',
      method: 'post',
      data: args
    });
  },
  getProjectConfigure(args) {
    return fetch({
      url: urlStr + '/planNote/configure',
      method: 'post',
      data: args
    });
  },

  /**
   * 查询默认项目
   *
   * @param {*} args
   * 暂无参数
   * @returns
   */
  getProjectForDefault(args) {
    return fetch({
      url: '/easywork/api/platform/favorite/project/query',
      method: 'post',
      data: args
    });
  },

  /**
   *  保存默认项目
   *
   * @param {*} args
   * businessId: 项目ID
   * @returns
   */
  saveProjectForDefault(args) {
    return fetch({
      url: '/easywork/api/platform/favorite/project/save',
      method: 'post',
      data: args
    });
  },

  /**
   *  项目详情
   *
   * @param {*} args
   * id: 项目ID
   * @returns
   */
  getProjectDetail(args) {
    return fetch({
      url: `${ urlStr }/detail`,
      method: 'post',
      data: args
    });
  },
  /**
   *  我的任务
   *
   * @param {*} args
   * argsMap: {
   *  receiverId: 当前用户id，
   *  projectId： 项目id (选填)
   * }
   * pageNum 页数
   * pageCount 每页数量
   * @returns
   */
  getProjectTask(args) {
    return fetch({
      url: '/easywork/api/platform/message/list/query',
      method: 'post',
      data: args
    });
  },

  /**
   *  成本统计

   *
   * @param {*} args
   * projectId
   * @returns
   */
  getCost(args) {
    return fetch({
      url: `${ urlStr }/budget/count/cost`,
      method: 'post',
      data: args
    });
  },

  /**
   * 风险问题统计
   *
   * @param {*} args
   * projectId
   * @returns
   */
  getRiskProblem(args) {
    return fetch({
      url: `${ urlStr }/riskproblem/count`,
      method: 'post',
      data: args
    });
  },

  /**
   *  导出项目报告
   *
   * @param {*} args
   * id
   * @returns
   */
  exportProjectReport(args) {
    return fetch({
      url: `${ urlStr }/projectInfo/exportWeekReport`,
      method: 'get',
      params: args,
      responseType: 'blob'
    });
  },

  /**
   * 导出数据
   *
   * @param {*} args
   * id
   * @returns
   */
  exportProjectData(args) {
    return fetch({
      url: `${ urlStr }/projectInfo/exportStatisticsReport`,
      method: 'post',
      data: args,
      responseType: 'blob'
    });
  }
};
