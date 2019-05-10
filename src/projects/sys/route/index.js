import permission from './permission';
// import setting from './setting.js';
import routeTem from '@/components/routeTem';
const layout = () => import('@/projects/sys/views/layout');
export default [ {
  path: '/sys',
  component: routeTem,
  children: [ {
    path: '/',
    name: 'sys',
    component: layout,
    children: [ ...permission ]
  } ]
} ];