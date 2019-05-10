const routeTem = () => import('@/components/routeTem'),
  Detail = () => import('@/projects/outsourcer/views/settlement/detail'),
  Apply = () => import('@/projects/outsourcer/views/settlement/apply');
const route = [
  {
    path: '/settlement',
    component: routeTem,
    children: [
      {
        path: 'detail',
        name: 'settlementDetail',
        component: Detail
      },
      {
        path: 'apply',
        name: 'settlementApply',
        component: Apply
      }
    ]
  }
  // {
  //   path: '/settlement/detail',
  //   name: 'settlementDetail',
  //   component: Detail
  // },
  // {
  //   path: '/settlement/apply',
  //   name: 'settlementApply',
  //   component: Apply
  // }
];

export default route;
