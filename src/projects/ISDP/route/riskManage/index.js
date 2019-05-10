const routeTem = () => import('@/components/routeTem'),
  riskMaintenance = () => import('@ISDP/views/riskManage/riskMaintenance');
export default [
  {
    path: 'risk',
    component: routeTem,
    children: [
      {
        path: 'riskMaintenance',
        name: 'ISDPRiskMaintenance',
        component: riskMaintenance
      }
    ]
  }
];
