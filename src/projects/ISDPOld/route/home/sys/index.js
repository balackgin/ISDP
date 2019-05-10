import routeConfig from '@/route/config/oldISDP.config';
// import businessDetail from './businessDetail';
const sys = () => import('@/projects/ISDPOld/views/sys/list/index'),
  sysRoles = () => import('@/projects/ISDPOld/views/sys/list/roles');

const routes = [
  {
    path: 'sys',
    component: sys,
    children: [
      {
        path: '',
        name: routeConfig.sysHome,
        redirect: {
          name: routeConfig.sysRoles
        }
      },
      {
        path: 'roles',
        name: routeConfig.sysRoles,
        component: sysRoles
      }
    ]
  }
];

export default routes;
