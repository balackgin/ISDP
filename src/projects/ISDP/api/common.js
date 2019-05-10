import fetch from '@/utils/fetch';
export default {
  /**
   *  按项目查询当前菜单树
   *
   * @param {*} args
   * project: 项目ID
   * @returns
   */
  getMenuList(args) {
    return fetch({
      url: '/easywork/api/platform/element/person/tree/query',
      method: 'post',
      data: args
    });
  },

  /**
   *    收藏删除
   *
   * @param {*} args
   * @returns
   */
  delMenu(args) {
    return fetch({
      url: '/easywork/api/platform/favorite/menu/del',
      method: 'post',
      data: args
    });
  },

  /**
   * 保存收藏
   *
   * @param {*} args
   * @returns
   */
  saveMenu(args) {
    return fetch({
      url: '/easywork/api/platform/favorite/menu/save',
      method: 'post',
      data: args
    });
  },

  /**
   * 查询用户收藏菜单
   *
   * @param {*} args
   * @returns
   */
  getFavoriteMenu(args) {
    return fetch({
      url: '/easywork/api/platform/favorite/menu/query',
      method: 'post',
      data: args
    });
  },

  /**
   * 里程碑列表
   *
   * @param {*} args
   * projectId
   * @returns
   */
  getMilestoneList(args) {
    return fetch({
      url: '/easywork/api/project/milestone/list/query',
      method: 'post',
      data: args
    });
  }
};
