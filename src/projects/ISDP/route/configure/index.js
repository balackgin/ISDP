const routeTem = () => import('@/components/routeTem'),
  configurePersonnel = () =>
    import('@/projects/ISDP/views/configure/personnel'),
  configureRole = () => import('@ISDP/views/configure/role'),
  configureWBS = () => import('@ISDP/views/configure/wbs'),
  configureMilepost = () => import('@ISDP/views/configure/milepost');

const routes = [
  {
    path: 'configure',
    component: routeTem,
    children: [
      {
        path: '',
        redirect: 'ISDPConfigurePersonnel'
      },
      {
        path: 'personnel',
        name: 'ISDPConfigurePersonnel',
        component: configurePersonnel
      },
      {
        path: 'role',
        name: 'ISDPConfigureRole',
        component: configureRole
      },
      {
        path: 'wbs',
        name: 'ISDPConfigureWBS',
        component: configureWBS
      },
      {
        path: 'milepost',
        name: 'ISDPConfigureMilepost',
        component: configureMilepost
      }
    ]
  }
];

export default routes;
