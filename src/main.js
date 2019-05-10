import Vue from 'vue';
import NProgress from 'nprogress';
// import './plugins/axios';
import ProxyElementUi from './plugins/proxyElementUi';
import App from './App.vue';
import router from './router';
import store from './store';
import './utils/extend';
import Element from 'element-ui';
import './assets/fontawesome-free-5.5.0-web/css/all.min.css';
import './assets/style/index.less';
import 'nprogress/nprogress.css';
import 'amfe-flexible';
// import IconSvg from "@/components/IconSvg";
// import CollapseTransition from 'element-ui/lib/transitions/collapse-transition';
// Vue.component(CollapseTransition.name, CollapseTransition);
Vue.use(Element);
Vue.use(ProxyElementUi);

Vue.config.productionTip = false;
NProgress.configure({
  showSpinner: false,
  minimum: 0.3
});
router.beforeEach(async (to, from, next) => {
  NProgress.start();
  store.commit('common/SET_ROUTE', {
    to,
    from
  });
  next();
});
router.afterEach(() => {
  NProgress.done();
});
// store.commit('common/GET_SYSTEM');  // 判断当前所在系统
const myApp = new Vue({
  router,
  store,
  render: (h) => h(App)
});

document.addEventListener('dragstart', function(event) {
  //阻止拖文本
  event.preventDefault();
});

myApp.$mount('#app');
export default myApp;
