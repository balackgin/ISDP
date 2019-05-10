import common from './modules/common';
import project from './/modules/project';
import configure from './modules/configure';
import range from './modules/range';
import projectStart from './modules/projectStart';
import operationManage from './modules/operationManage';
import progressManage from './modules/progressManage';
const store = {
  namespaced: true,
  modules: {
    common,
    project,
    configure,
    range,
    operationManage,
    projectStart,
    progressManage
  }
};

export default store;