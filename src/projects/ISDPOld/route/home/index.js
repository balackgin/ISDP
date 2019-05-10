import project from './project/index';
import colony from './projectColony/index';
import classify from './classify/index';
import sys from './sys/index';
const route = [ ...project, ...colony, ...classify, ...sys ];
export default route;