import axios from 'axios';
// import {
//   Loading,
//   Message
// } from 'element-ui';

import qs from 'qs';
import store from '@/store';
import router from '@/router';
import proxyElementUi from '@/plugins/proxyElementUi';
const { elLoading, elMessage, elTooltip } = proxyElementUi;
// axios.defaults.withCredentials = true;
let sessionApi = [], //存储请求链接 作为唯一标识  成功返回则删除 为空时 关闭loading
  time = ''; //做个倒计时
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // api的base_url
  timeout: 60000, // request timeout  60s
  headers: {}
  // headers: {
  //   'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  //   'X-Requested-With': 'XMLHttpRequest'
  // }
});

service.defaults.withCredentials = false; // true请求头带凭证cookie

// let loading = null;
function exitStatus() {
  const routeName = router.currentRoute.name;
  if (routeName && !routeName.includes('Login')) {
    let stateCommon = store.state.common;
    stateCommon &&
      stateCommon.systemActive.login &&
      router.push({
        name: stateCommon.systemActive.login
      });
  }
}

function errMsg(msg, show = true) {
  if (show && msg) {
    const currentPath = router.currentRoute.path,
      flag = currentPath.includes('/ISDP/');
    flag
      ? elTooltip({
        message: msg,
        type: 'error'
      })
      : elMessage({
        message: msg,
        type: 'error'
      });
  }
}

// request interceptor
service.interceptors.request.use(
  async (config) => {
    // Do something before request is sent
    if (config.loading !== false) {
      sessionApi.length === 0 && elLoading();
      sessionApi.push(config.url);
    }
    let stateCommon = store.state.common;
    if (config.url.includes('easywork/api/project')) {
      //ISDP 项目部门统一加projectId  判断权限
      let toObjData = config.data || {};
      config.headers['projectId'] =
        router.currentRoute.query.id || toObjData.id || toObjData.projectId;
    }
    if (stateCommon.token) {
      // 让每个请求携带token-- ['X-Authorization']为自定义key 请根据实际情况自行修改
      config.headers['token'] = stateCommon.token;
    } else {
      exitStatus();
    }

    if (config.formData) {
      config.data = qs.stringify(config.data);
    }

    return config;
  },
  (error) => {
    // Do something with request error
    console.log('request err:', error.toString()); // for debug
    Promise.reject(error);
  }
);

// respone interceptor
service.interceptors.response.use(
  (response) => {
    // 清除loading start
    clearTimeout(time);
    let index = sessionApi.findIndex((item) => item === response.config.url);
    sessionApi.splice(index, 1);
    time = setTimeout(() => {
      !sessionApi || (!sessionApi.length && elLoading(false));
    }, 300);
    // 清除loading end
    const { data = {} } = response;
    if (data.resultCode === 'AU412') {
      exitStatus();
    } else if (
      data.resultCode &&
      !data.resultCode.includes('20') &&
      +data.resultCode !== 200
    ) {
      errMsg(data.resultMessage, response.config.showMessage !== false);
    }

    // 如果响应类型是 blob 直接返回response 用来判断文件类型
    if (response.config.responseType === 'blob') {
      return response;
    }
    return data;
  },
  (error) => {
    elLoading(false);
    sessionApi = [];
    errMsg(((error.config && error.config.url) || '') + '出现错误!');
    console.log('response err:' + error.toString()); // for debug
    // return error;
    return {};
  }
);

export default service;
