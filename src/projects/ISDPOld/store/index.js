import common from './modules/common';
import project from './modules/project';
import sys from './modules/sys';

const store = {
  namespaced: true,
  modules: {
    common,
    project,
    sys
  }
};

export default store;