import fetch from '@/utils/fetch';
const apiPath = '/easywork/api/project';
// const apiPath = '';
export default {
  /**
   * 项目预算展示
   *
   * @param {*} args
   * projectId: 项目ID
   * @returns
   */
  getBudgetList(args) {
    return fetch({
      url: `${ apiPath }/budget/show`,
      method: 'post',
      data: args
    });
  },

  /**
   * 预算发布
   *
   * @param {*} args
   * projectId: 项目ID
   * @returns
   */
  publishBudget(args) {
    return fetch({
      url: `${ apiPath }/budget/publish`,
      method: 'post',
      data: args
    });
  },

  /**
   * 预算模板导出
   *
   * @param {*} args
   * projectId
   * @returns
   */
  exportBudget(args) {
    return fetch({
      url: `${ apiPath }/budget/export`,
      method: 'post',
      responseType: 'blob',
      data: args
    });
  }
};
