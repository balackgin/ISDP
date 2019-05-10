import homeRoute from './home/index';
// import loginRoute from './user';
import applyRoute from './apply';
const routeTem = () => import('@/components/routeTem'),
  Layout = () => import('@/projects/outsourcer/views/layout');

const route = [
  {
    path: 'outsourcer',
    component: routeTem,
    children: [
      {
        path: '',
        redirect: {
          name: 'outsourcerBaseinfo'
        }
      },
      {
        path: '/',
        component: Layout,
        children: [
          {
            path: '',
            name: 'outsourcerHome',
            redirect: {
              name: 'outsourcerBaseinfo'
            }
          },
          ...homeRoute
        ]
      },
      // ...loginRoute,
      ...applyRoute,
      {
        path: '*',
        redirect: {
          name: 'outsourcerBaseinfo'
        }
      }
    ]
  }
];
export default route;
