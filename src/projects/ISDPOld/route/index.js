import homeRoute from './home/index';
import routeConfig from '@/route/config/oldISDP.config';
const routeTem = () => import('@/components/routeTem'),
  layout = () => import('@/projects/ISDPOld/views/layout/');
const routes = [
  {
    path: routeConfig.path,
    component: routeTem,

    children: [
      {
        path: '',
        redirect: {
          name: routeConfig.projectList
        }
      },
      {
        path: '/',
        component: layout,
        children: [
          {
            path: '',
            redirect: {
              name: routeConfig.projectList
            }
          },
          ...homeRoute
        ]
      },
      {
        path: '*',
        redirect: {
          name: routeConfig.projectList
        }
      }
    ]
  }
];

export default routes;
