import detailRoutes from './detail.js';
import routeConfig from '@/route/config/oldISDP.config';
// import businessDetail from './businessDetail';
const project = () => import('@/projects/ISDPOld/views/project/list/index'),
  projectList = () => import('@/projects/ISDPOld/views/project/list/list'),
  projectReport = () => import('@/projects/ISDPOld/views/project/list/report'),
  projectDemo = () => import('@/projects/ISDPOld/views/project/list/demo');

const routes = [
  {
    path: 'project',
    component: project,
    children: [
      {
        path: '',
        name: routeConfig.projectHome,
        redirect: {
          name: routeConfig.projectList
        }
      },
      {
        path: 'list',
        name: routeConfig.projectList,
        component: projectList
      },
      {
        path: 'report',
        name: routeConfig.projectReport,
        component: projectReport
      },
      {
        path: 'demo',
        name: routeConfig.projectDemo,
        component: projectDemo
      }
    ]
  },
  ...detailRoutes
  // ...businessDetail
];

export default routes;
