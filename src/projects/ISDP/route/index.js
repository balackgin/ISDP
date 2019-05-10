import project from './project';
import configure from './configure';
import progressManage from './progressManage';
import rangen from './rangen';
import operationManage from './operationManage';
import riskManage from './riskManage';
// const routeTem = () => import('@ISDP/views');
const layout = () => import('@ISDP/views/layout/projectLayout'),
  notFound = () => import('@ISDP/views/notFound');

const defaultRoute = (path = '') => ({
  path,
  redirect: {
    name: 'ISDPProjectAllDefault'
  }
});

const routes = [
  {
    path: 'ISDP',
    component: layout,
    children: [
      defaultRoute(),
      ...project,
      ...configure,
      ...progressManage,
      ...rangen,
      ...operationManage,
      ...riskManage,
      {
        path: '404',
        name: 'ISDPNotFound',
        meta: {
          permission: true
        },
        component: notFound
      },
      defaultRoute('*') // 404
    ]
  }
];

export default routes;
