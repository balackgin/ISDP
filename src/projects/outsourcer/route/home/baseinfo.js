const routeTem = () => import('@/projects/outsourcer/views/baseinfo/index'),
  baseinfoIndex = () => import('@/projects/outsourcer/views/baseinfo/baseinfo'),
  baseinfoDetail = () => import('@/projects/outsourcer/views/baseinfo/detail');
const route = [
  {
    path: 'baseinfo',
    component: routeTem,
    children: [
      {
        path: '',
        name: 'outsourcerBaseinfo',
        redirect: {
          name: 'outsourcerBaseinfoIndex'
        }
      },
      {
        path: 'index',
        name: 'outsourcerBaseinfoIndex',
        component: baseinfoIndex
      },
      {
        path: 'detail',
        name: 'outsourcerBaseinfoDetail',
        component: baseinfoDetail
      }
    ]
  }
];

export default route;
