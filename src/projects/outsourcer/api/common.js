import fetch from '@/utils/fetch';
export default {
  /**
   *  用户信息匹配外包商信息
   *
   * @returns
   */
  getOutsourcerInfo(args = {}) {
    return fetch({
      url: '/easywork/api/contractor/querybyowner',
      method: 'post',
      showMessage: false,
      loading: args.loading || false
    });
  }
};
