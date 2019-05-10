const routeTem = () => import('@/components/routeTem'),
  detail = () => import('@orderVis/views/detail'),
  list = () => import('@orderVis/views/list');

export default [
  {
    path: 'orderVis',
    component: routeTem,
    children: [
      {
        path: '',
        name: 'orderVisList',
        component: list
      },
      {
        path: 'detail',
        name: 'orderVisDetail',
        component: detail
      }
    ]
  }
];
