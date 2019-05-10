const routeTem = () => import('@/components/routeTem'),
  feedback = () => import('@ISDP/views/operationManage/feedback'),
  budget = () => import('@ISDP/views/operationManage/budget');
export default [
  {
    path: 'operation',
    component: routeTem,
    children: [
      {
        path: '',
        name: 'ISDPOperationBudget',
        component: budget
      },
      {
        path: 'feedback',
        name: 'ISDPOperationFeedback',
        component: feedback
      }
    ]
  }
];
