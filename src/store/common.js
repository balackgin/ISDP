import { setCookies, removeCookies, getCookies } from '@/utils/auth';
import api from '@/api/common';
import router from '@/router';
import { storage } from '@/utils/session';
import system from './config/system';
import citys from './config/citys';
const matchRoute = (args) => {
  let currentRoute = router.currentRoute;
  return (
    (currentRoute.name && currentRoute.name.includes(args)) ||
    (currentRoute.path && currentRoute.path.includes(args)) ||
    location.pathname.includes(args) ||
    location.hash.includes(args) // IE location.hash
  );
};

const common = {
  namespaced: true,
  state: {
    token: null, // token
    regexp: {
      //常用正则
      isMobile: /^(\+\d{2})?1[3-9]\d{9}$/, //手机号
      mobile: /^(\+\d{2})?1[3-9]\d{9}$|^(\d{3,4}-)?\d{7,8}$/, //手机号/座机
      IDNum: /^[1-9]\d{16}[x|X|\d]$/, //身份证
      email: /^[\d\w-_]*@{1}[\d\w]*\.{1}[\w]*$/ //邮箱
    },
    userinfo: null, //用户信息
    system, // 多系统基础配置
    systemActive: null, // 当前系统基础配置
    sessionRoute: {}, // 保存上个路由信息
    citys, //城市数据 外包商纳入申请
    interimVal: undefined, // 临时数据 搜索条件保存
    IEVersion: 0 // 0: 不是IE; -1: Edge; 9,10,11对应版本浏览器
  },
  mutations: {
    SET_ROUTE(state, { to, from }) {
      state.sessionRoute = {
        next: to,
        prev: from
      };
    },
    // GET_HEADER(state, data) {
    //   state.header = data;
    // },
    SET_TOKEN(state, val) {
      state.token = val;
    },
    SET_USER_INFO(state, data) {
      state.userinfo = data;
    },
    DEL_TOKEN(state) {
      //登录的时候调用
      const { systemActive = {} } = state;
      matchRoute(systemActive.name) &&
        storage(systemActive.name, '', {
          isDel: true
        });
      state.token = '';
    },
    GET_SYSTEM(state, token) {
      let systemActive = null,
        session = null,
        tokenObj = {
          token
        };
      switch (true) {
      case matchRoute('OISDP'):
        systemActive = system['OISDP'];
        token && storage('OISDP', tokenObj);
        session = token ? tokenObj : storage('OISDP');
        break;
      case matchRoute('ISDP'):
        systemActive = system['ISDP'];
        token && storage('ISDP', tokenObj);
        session = token ? tokenObj : storage('ISDP');
        break;
      case matchRoute('management'):
        systemActive = system['management'];
        token && storage('management', tokenObj);
        session = token ? tokenObj : storage('management');
        break;
      case matchRoute('outsourcer'):
        systemActive = system['outsourcer'];
        token && storage('outsourcer', tokenObj);
        session = token ? tokenObj : storage('outsourcer');
        break;
      case matchRoute('sys'):
        systemActive = system['sys'];
        token && storage('sys', tokenObj);
        session = token ? tokenObj : storage('sys');
        break;
      default:
        break;
      }
      if (systemActive) {
        systemActive.session = session;
        state.token = session && session['token'];
        state.systemActive = systemActive;
        setTimeout(() => {
          const userAgent = navigator.userAgent;
          let resultVer =
            userAgent.includes('Trident') && userAgent.includes('rv:11.0')
              ? 11
              : 0; // ||userAgent.includes('Edge') && -1
          if (userAgent.includes('compatible') && userAgent.includes('MSIE')) {
            const ieVer = userAgent.replace(/^.*MSIE\s*(\d+\.\d).*$/, '$1');
            resultVer = ieVer;
          }
          state.IEVersion = resultVer;
        });
      }
    },
    SET_INTERIM_VAL(state, val) {
      state.interimVal = val;
    }
  },
  actions: {
    async getCookies(store, val) {
      let result = await getCookies(val);
      return result;
    },
    async setCookies(store, { key, data }) {
      let result = await setCookies(key, data);
      return result;
    },
    async removeCookies(store, val) {
      let result = await removeCookies(val);
      return result;
    },
    session(store, params) {
      let { key, val, action = {} } = params;
      let interimVal = storage(key, val, action);
      store.commit('SET_INTERIM_VAL', interimVal);
    },
    async getUserInfo(store, params) {
      let { data } = (await api.getUserInfo(params)) || {};
      if (!data) {
        store.commit('SET_USER_INFO', null);
        return false;
      }
      const usertype = data.usertype || '',
        nickname = data.nickname || '',
        username = data.username || '';

      const type = usertype.split(',');
      data.user = nickname + ' (' + username + ')';
      data.usertype = type;
      data.pmo = type.includes('pmo') || type.includes('apmo');

      store.commit('SET_USER_INFO', data);
      return data;
    },
    getApproval(store, params) {
      return api.getApproval(params);
    },
    getProjectForApproval(store, params) {
      return api.getProjectForApproval(params);
    },
    download(store, { url, params }) {
      return api.download(url, params);
    }
  }
};

export default common;
