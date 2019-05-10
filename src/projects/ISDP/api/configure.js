import fetch from '@/utils/fetch';
// import {
//   getApiQuery
// } from '@/utils/getApiQuery';
const platform = '/easywork/api/platform';
const project = '/easywork/api/project';
// const project = '';
export default {
  getRoleList(args) {
    return fetch({
      url: platform + '/role/list/query',
      method: 'post',
      data: args //post传参数
      // params: args //get传参数
    })
  },
  saveRoles(args) {
    return fetch({
      url: platform + '/role/save',
      method: 'post',
      data: args
    })
  },
  deleteRole(args) {
    return fetch({
      url: platform + '/role/delete',
      method: 'post',
      data: args
    })
  },
  saveElement(args) {
    return fetch({
      url: platform + '/element/permission/save',
      method: 'post',
      data: args
    })
  },
  getElements(args) {
    return fetch({
      url: platform + '/element/roles/tree/query',
      method: 'post',
      data: args
    })
  },
  getMemberList(args) {
    return fetch({
      url: platform + '/role/mapping/list/query',
      method: 'post',
      data: args
    })
  },
  deleteMember(args) {
    return fetch({
      url: platform + '/role/mapping/del',
      method: 'post',
      data: args
    })
  },
  saveMember(args) {
    return fetch({
      url: platform + '/role/mapping/save',
      method: 'post',
      data: args
    })
  },
  //公共配置 wbs设置
  getProjectGroupList(args) {
    return fetch({
      url: project + '/wbsTemplate/findList',
      method: 'post',
      data: args
    })
  },
  getDetailJobTemplate(args) {
    return fetch({
      url: project + '/wbsTemplate/detailJobTemplate',
      method: 'post',
      data: args
    })
  },
  saveDeliverableTemplate(args) {
    return fetch({
      url: project + '/wbsTemplate/saveDeliverableTemplate',
      method: 'post',
      data: args
    })
  },
  deleteDeliverableTemplate(args) {
    return fetch({
      url: project + '/wbsTemplate/deleteDeliverableTemplate',
      method: 'post',
      data: args
    })
  },
  issueJobTemplate(args) {
    return fetch({
      url: project + '/wbsTemplate/issueJobTemplate',
      method: 'post',
      data: args
    })
  },
  deleteAttachment(args) {
    return fetch({
      url: project + '/wbsTemplate/deleteAttachment',
      method: 'post',
      data: args
    })
  },

  //里程碑设置
  //里程列表
  getMilepostListQuery(args) {
    return fetch({
      url: project + '/milestone/template/list/query',
      method: 'post',
      data: args
    })
  },
  //wbs 必填项
  gitMilepostWbsOptList(args) {
    return fetch({
      url: project + '/wbsTemplate/queryList',
      method: 'post',
      data: args
    })
  },
  //集成子计划选项
  gitMilepostOptList(args) {
    return fetch({
      url: platform + '/queryCodeArray',
      method: 'post',
      data: args
    })
  },
  //里程碑保存../milestone/template/save
  saveMilepost(args) {
    return fetch({
      url: project + '/milestone/template/save',
      method: 'post',
      data: args
    })
  }
}