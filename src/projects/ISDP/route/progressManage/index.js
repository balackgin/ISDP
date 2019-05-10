const routeTem = () => import('@/components/routeTem'),
  ProgressHome = () => import('@ISDP/views/progressManage/progressHome'),
  ProgressExternal = () => import('@ISDP/views/progressManage/externalField');
// ProgressExternalFeedback = () =>
//   import('@ISDP/views/progressManage/externalFeedback');

export default [
  {
    path: 'progress',
    component: routeTem,
    children: [
      {
        path: '',
        name: 'ISDPProgressHome',
        component: ProgressHome
      },
      {
        path: 'externalField',
        name: 'ISDPProgressExternalField',
        component: ProgressExternal
      },
      {
        path: 'externalFeedback',
        name: 'ISDPProgressExternalFeedback',
        component: ProgressExternal
      }
    ]
  }
];
