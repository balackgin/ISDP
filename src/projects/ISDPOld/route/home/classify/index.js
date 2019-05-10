import routeConfig from '@/route/config/oldISDP.config';
// import businessDetail from './businessDetail';
const classify = () => import('@/projects/ISDPOld/views/classify/list/index'),
  classifyList = () => import('@/projects/ISDPOld/views/classify/list/list');

const routes = [
  {
    path: 'classify',
    component: classify,
    children: [
      {
        path: '',
        name: routeConfig.classifyHome,
        redirect: {
          name: routeConfig.classifyList
        }
      },
      {
        path: 'list',
        name: routeConfig.classifyList,
        component: classifyList
      }
    ]
  }
];

export default routes;
