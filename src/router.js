import Vue from 'vue';
import Router from 'vue-router';
import Meta from 'vue-meta';

import routeTem from '@/views/layout';

import commonRoute from './route/common';
import outsourcerRoute from './projects/outsourcer/route';
import ISDPRoute from './projects/ISDP/route';
import ISDPOldRoute from './projects/ISDPOld/route';
import managementRoute from './projects/management/route';
// import sysRoute from './projects/sys/route';
import orderVisRoute from '@orderVis/route';
Vue.use(Router);
Vue.use(Meta);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: () => ({
    y: 0
  }),

  routes: [
    {
      path: '',
      component: routeTem,
      children: [
        ...commonRoute,
        ...outsourcerRoute,
        ...ISDPRoute,
        ...ISDPOldRoute,
        ...managementRoute,
        ...orderVisRoute
      ]
    }
  ]
});
