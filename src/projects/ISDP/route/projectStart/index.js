const routeTem = () => import('@/components/routeTem'),
  wbsMaintain = () => import('@ISDP/views/projectStart/wbs/maintain'),
  wbsTask = () => import('@ISDP/views/projectStart/wbs/task'),
  state = () => import('@ISDP/views/projectStart/wbs/state'),
  approval = () => import('@ISDP/views/projectStart/approval'),
  team = () => import('@ISDP/views/projectStart/team');

export default [
  {
    path: 'wbsManage',
    component: routeTem,
    children: [
      {
        path: '', //state
        name: 'ISDPProjectStartWBSState',
        component: state
      },
      {
        path: 'maintain', // maintain
        name: 'ISDPPorjectStartWBSMaintain',
        component: wbsMaintain
      },
      {
        path: 'task', // wbstask
        name: 'ISDPPorjectStartWBSTask',
        component: wbsTask
      }
    ]
  },
  {
    path: 'approval',
    name: 'ISDPProjectStartApproval',
    component: approval
  },
  {
    path: 'team',
    name: 'ISDPProjectStartTeam',
    component: team
  }
];
