import fetch from '@/utils/fetch';

const urlStr = '/easywork/api/platform'

export default {

  /**
   * 角色成员列表查询
   *
   * @param {*} args
   * @returns
   */
  getRoleMember(args) {
    return fetch({
      url: urlStr + '/role/rolelist',
      method: 'post',
      data: args
    })
  },
  /**
   * 角色列表查询
   *
   * @param {*} args
   * content 内容
   * pageIndex 页数
   * pageSize 每页条数
   * roleId 角色id
   * @returns
   */
  getRoleList(args) {
    return fetch({
      url: urlStr + '/role/list',
      method: 'post',
      data: args
    })
  },
  addRoleMember(args) {
    return fetch({
      url: urlStr + '/role/addrolemappings',
      method: 'post',
      data: args
    })
  },
  deleteRoleMember(args) {
    return fetch({
      url: urlStr + '/role/delrolemapping',
      method: 'post',
      data: args
    })
  },
  addRole(args) {
    return fetch({
      url: urlStr + '/role/add',
      method: 'post',
      data: args
    })
  },
  deleteRole(args) {
    return fetch({
      url: urlStr + '/role/delete',
      method: 'post',
      data: args
    })
  }
}