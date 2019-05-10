import Vue from 'vue';
import Vuex from 'vuex';
// import common from './modules/common';
// import project from './modules/project';
import ISDP from './projects/ISDP/store';
import ISDPOld from './projects/ISDPOld/store';
import sys from './projects/sys/store';
import outsourcer from './projects/outsourcer/store';
import management from './projects/management/store';
import orderVis from '@orderVis/store';
import common from './store/common';
import user from './store/user';
Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    common,
    user,
    sys,
    ISDP,
    ISDPOld,
    outsourcer,
    management,
    orderVis
  }
});

export default store;
