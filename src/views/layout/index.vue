<template>
  <router-view />
</template>
<script>
import store from '@/store';
export default {
  async beforeRouteEnter(to,from,next){ //同样的代码在router.js beforeRoute 应该是存在bug 路由改变了 url没改变
    // URL传参token
    const { query: toQuery, name: toName = '' } = to,
      { token: toQueryToken } = toQuery;

    let nextRouteName = {
      name: toName,
      query: toQuery.toJson()   // !!!
    };

    store.commit('common/GET_SYSTEM', toQueryToken); // 存token 并判断当前所在系统

    if (!toName.includes('Login') && !to.name.includes('orderVis')) {
      // 前往非登录页时 存token 再取store.token  不存在返回登录页
      const data = await store.dispatch('common/getUserInfo');
      const { systemActive, token } = store.state.common;
      if (systemActive && (!data || !token)) {
        //返回false去登录页
        nextRouteName = {
          name: systemActive.login
        };
      } else {
        systemActive.name === 'ISDP' && !toQuery.id && data.projectId
          ? (nextRouteName.query = {
            id: data.projectId
          })
          : '';
      }
    }
    next((vm) => {
      vm.$router.push(nextRouteName)
    });
  }
}
</script>
