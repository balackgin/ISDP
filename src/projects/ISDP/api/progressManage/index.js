import fetch from '@/utils/fetch';

const urlStr = '/easywork/taskman';
export default {
  maintainState(args) {
    return fetch({
      url: urlStr + '/outfieldsubplan/listPage',
      method: 'post',
      data: args
    });
  },

  /**
   *  外场施工进度图表
   *
   * @param {*} args
   * projectId
   * @returns
   */
  getOutfieldConstructionChart(args) {
    return fetch({
      url: '/easywork/api/taskman/overallprogress/listProgress',
      method: 'post',
      data: args
    });
  }
};
