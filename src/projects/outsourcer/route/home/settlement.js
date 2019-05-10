const routeTem = () => import('@/projects/outsourcer/views/settlement/index'),
  PayList = () => import('@/projects/outsourcer/views/settlement/payList'),
  List = () => import('@/projects/outsourcer/views/settlement/list');

const route = [
  {
    path: 'settlement',
    component: routeTem,
    children: [
      {
        path: '',
        name: 'outsourcerSettlement',
        redirect: {
          name: 'outsourcerSettlementPayList'
        }
      },
      {
        path: 'payList',
        name: 'outsourcerSettlementPayList',
        component: PayList
      },
      {
        path: 'list',
        name: 'outsourcerSettlementList',
        component: List
      }
    ]
  }
];

export default route;
