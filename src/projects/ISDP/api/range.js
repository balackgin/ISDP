import fetch from '@/utils/fetch';
const range = '/easywork/api/taskman';
// const range = ''
export default {
  findByPointPositionAndArea(args) {
    return fetch({
      url: range + '/pointposition/list/findByPointPositionAndArea',
      method: 'post',
      data: args //post传参数
      // params: args //get传参数
    })
  }, //获取点位列表
  savePoint(args) {
    return fetch({
      url: range + '/pointposition/save',
      method: 'post',
      data: args //post传参数
      // params: args //get传参数
    })
  }, //新增点位
  updatePoint(args) {
    return fetch({
      url: range + '/pointposition/update',
      method: 'post',
      data: args
    })
  }, //修改点位
  issuePoint(args) {
    return fetch({
      url: range + '/pointposition/issue',
      method: 'post',
      data: args
    })
  }, //发布
  stopPoint(args) {
    return fetch({
      url: range + '/pointposition/stop',
      method: 'post',
      data: args
    })
  }, //停用
  exportPoint(args) {
    return fetch({
      url: range + '/pointposition/export',
      method: 'post',
      params: args,
      responseType: 'blob'
    })
  } //导出

}