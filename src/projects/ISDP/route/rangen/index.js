const routeTem = () => import('@/components/routeTem'),
  // rangenPpoint = () =>
  //         import('@/projects/ISDP/views/configure/personnel'),
  rangenPoint = () => import('@ISDP/views/configure/pointManagement');

const routes = [ {
  path: 'rangen',
  component: routeTem,
  children: [ {
    path: '',
    redirect: 'ISDPRangenPoint'
  },
  {
    path: 'pointManagement',
    name: 'ISDPRangenPoint',
    component: rangenPoint
  }
  ]
} ];

export default routes;