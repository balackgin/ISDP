import projectStart from '../projectStart';
const routeTem = () => import('@/components/routeTem'),
  // const layout = () => import('@ISDP/views/layout/projectLayout'),
  projectHome = () => import('@ISDP/views/project/home'),
  projectAll = () => import('@ISDP/views/project/all'),
  projectAllDefault = () => import('@ISDP/views/project/all/default'),
  projectMyTask = () => import('@ISDP/views/project/all/myTask'),
  projectMyApproval = () => import('@ISDP/views/project/all/myApproval'),
  projectConfigure = () => import('@ISDP/views/project/proConfigure'),
  projectTemporaryRole = () => import('@ISDP/views/project/temporaryRole'),
  projectDemo = () => import('@ISDP/views/demo');

const routes = [
  {
    path: 'project',
    component: routeTem,
    children: [
      {
        path: '',
        name: 'ISDPProjectHome',
        component: projectHome
      },
      {
        path: 'all',
        component: projectAll,
        children: [
          {
            path: '',
            name: 'ISDPProjectAllDefault',
            component: projectAllDefault
          },
          {
            path: 'task',
            name: 'ISDPProjectAllMyTask',
            component: projectMyTask
          },
          {
            path: 'approval',
            name: 'ISDPProjectAllMyApproval',
            component: projectMyApproval
          }
        ]
      },
      {
        path: 'configure',
        name: 'ISDPProjectConfigure',
        component: projectConfigure
      },
      {
        path: 'temporaryRole',
        name: 'ISDPProjectTemporaryRole',
        component: projectTemporaryRole
      },
      {
        path: 'demo',
        name: 'demo',
        component: projectDemo
      },
      ...projectStart
    ]
  }
];

export default routes;
