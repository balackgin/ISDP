const routeTem = () => import('@/components/routeTem'),
  login = () => import('@/views/user/index'),
  portal = () => import('@/views/portal'),
  docCom = () => import('@/views/components'),
  fonts = () => import('@/views/fontawesome');
// refresh = () => import('@/views/refresh');

const route = [
  //   {
  //   path: '/login',
  //   component: routeTem,
  //   children: [ {
  //     path: 'ISDP',
  //     name: 'ISDPLogin',
  //     component: login
  //   },
  //   {
  //     path: 'outsourcer',
  //     name: 'outsourcerLogin',
  //     component: login
  //   },
  //   {
  //     path: 'management',
  //     name: 'managementLogin',
  //     component: login
  //   },
  //   {
  //     path: 'sys',
  //     name: 'sysLogin',
  //     component: login
  //   }
  //   ]
  // },
  {
    path: 'OISDP/login',
    name: 'OISDPLogin',
    component: login
  },
  {
    path: 'ISDP/login',
    name: 'ISDPLogin',
    component: login
  },
  {
    path: 'outsourcer/login',
    name: 'outsourcerLogin',
    component: login
  },
  {
    path: 'management/login',
    name: 'managementLogin',
    component: login,
    query: {
      title: '集成项目交付管理平台'
    }
  },
  // {
  //   path: '/sys/login',
  //   name: 'sysLogin',
  //   component: login
  // },
  {
    path: 'portal',
    component: routeTem,
    children: [
      {
        path: 'ISDP',
        name: 'ISDPPortal',
        component: portal
      },
      // {
      //   path: 'outsourcer',
      //   name: 'outsourcerPortal',
      //   component: portal
      // },
      {
        path: 'management',
        name: 'managementPortal',
        component: portal
      }
    ]
  },
  {
    path: 'fonts',
    component: fonts
  },
  {
    path: 'components/:name',
    component: docCom
  }
];

export default route;
