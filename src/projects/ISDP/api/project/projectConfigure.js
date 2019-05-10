import fetch from '@/utils/fetch';
const projectPath = '/easywork/api/project';
// const projectPath = '';
export default {
  /**
   *  计划配置
   *
   * @param {*} args
   * projectId
   * @returns
   */
  getPlanConfigure(args) {
    return fetch({
      url: `${ projectPath }/planNote/configure`,
      method: 'post',
      data: args
    });
  },

  /**
   * 下载模板
   *
   * @param {*} args
   * projectId
   * @returns
   */
  downloadPlanConfigure(args) {
    return fetch({
      url: `${ projectPath }/planNote/configure/exportByProjectId`,
      method: 'post',
      data: args,
      responseType: 'blob' // 默认已经返回文件流
    });
  },

  /**
   *  导入模板
   *
   * @param {*} args
   * projectId
   * excel
   * @returns
   */
  importPlanConfigure(args) {
    return fetch({
      url: `${ projectPath }/planNote/configure/importExcel`,
      method: 'post',
      data: args
    });
  },

  /**
   * 发布计划
   *
   * @param {*} args
   *
   * @returns
   */
  savePlan(args) {
    return fetch({
      url: `${ projectPath }/planNote/configure/savePlan`,
      method: 'post',
      data: args
    });
  }
};
