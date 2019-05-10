import Vue from 'vue';
import Vuex from 'vuex';
import common from './modules/common';
import apply from './modules/apply';
import project from './modules/project';

Vue.use(Vuex);
const store = {
  namespaced: true,
  modules: {
    common,
    apply,
    project
  }
};

export default store;
