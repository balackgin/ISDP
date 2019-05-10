import fetch from '@/utils/fetch';
export default {
  /**
   * 项目列表
   *
   * @param {*} args
   * @returns
   */
  list(args) {
    return fetch({
      url: '/easywork/api/project/list',
      methods: 'get',
      data: args
    });
  }
};
