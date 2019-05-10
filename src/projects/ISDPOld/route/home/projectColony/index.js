import routeConfig from '@/route/config/oldISDP.config';
import detailRoutes from './detail.js';
// import businessDetail from './businessDetail';
const colony = () => import('@/projects/ISDPOld/views/projectColony/list/index'),
  colonyList = () => import('@/projects/ISDPOld/views/project/list/list'),
  colonyReport = () =>
    import('@/projects/ISDPOld/views/projectColony/list/report'),
  colonyBusiness = () =>
    import('@/projects/ISDPOld/views/projectColony/list/business');

const routes = [
  {
    path: 'colony',
    component: colony,
    children: [
      {
        path: '',
        redirect: {
          name: routeConfig.colonyList
        }
      },
      {
        path: 'list',
        name: routeConfig.colonyList,
        component: colonyList
      },
      {
        path: 'business',
        name: routeConfig.colonyBusiness,
        component: colonyBusiness
      },
      {
        path: 'report',
        name: routeConfig.colonyReport,
        component: colonyReport
      }
    ]
  },
  ...detailRoutes
];

export default routes;
