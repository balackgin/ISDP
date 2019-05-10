import fetch from '@/utils/fetch';
// import {
//   getApiQuery
// } from '@/utils/getApiQuery';
const urlStr = '/easywork/api/platform';
export default {
  saveCodeClassify(args) {
    return fetch({
      url: urlStr + '/saveCodeClassify',
      method: 'post',
      data: args
    });
  },
  queryCodeArray(args) {
    return fetch({
      url: urlStr + '/queryCodeArray',
      method: 'post',
      data: args
    })
  },
  queryAllCodeClassify(args) {
    return fetch({
      url: urlStr + '/queryAllCodeClassify',
      method: 'post',
      data: args
    })
  }
};