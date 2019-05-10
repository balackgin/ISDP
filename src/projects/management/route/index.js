import outsourcerRoute from './outsourcer';
import children from './children';
const routeTem = () => import('@/components/routeTem'),
  layout = () => import('@/projects/management/views/layout');
export default [
  {
    path: 'management',
    component: routeTem,
    children: [
      {
        path: '',
        redirect: {
          name: 'managementOutsourcerApply'
        }
      },
      {
        path: '/',
        component: layout,
        children: [ ...outsourcerRoute ]
      },
      ...children,
      {
        path: '*',
        redirect: {
          name: 'managementOutsourcerApply'
        }
      }
    ]
  }
];
