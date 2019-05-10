import routeConfig from '@/route/config/oldISDP.config';
const colonyDetail = () => import('@/projects/ISDPOld/views/project/detail'),
  colonySurvey = () => import('@/projects/ISDPOld/views/project/detail/survey'),
  colonyWhole = () => import('@/projects/ISDPOld/views/project/detail/whole'),
  colonyManage = () => import('@/projects/ISDPOld/views/project/detail/manage'),
  colonyContract = () =>
    import('@/projects/ISDPOld/views/project/detail/contract'),
  colonyTeam = () => import('@/projects/ISDPOld/views/project/detail/team'),
  colonyPlan = () => import('@/projects/ISDPOld/views/project/detail/plan'),
  colonySupply = () => import('@/projects/ISDPOld/views/project/detail/supply'),
  colonyPurchase = () =>
    import('@/projects/ISDPOld/views/project/detail/purchase'),
  colonyAdmin = () => import('@/projects/ISDPOld/views/project/detail/admin'),
  colonyFinance = () => import('@/projects/ISDPOld/views/project/detail/finance'),
  colonyWeekly = () => import('@/projects/ISDPOld/views/project/detail/weekly');

const routes = [
  {
    path: 'colony/detail',
    component: colonyDetail,
    children: [
      {
        path: '',
        redirect: {
          name: routeConfig.colonySurvey
        }
      },
      {
        path: 'survey', //概况
        name: routeConfig.colonySurvey,
        component: colonySurvey
      },
      {
        path: 'whole',
        name: routeConfig.colonyWhole,
        component: colonyWhole
      },
      {
        path: 'manage', //管理
        name: routeConfig.colonyManage,
        component: colonyManage
      },
      {
        path: 'contract', //合同
        name: routeConfig.colonyContract,
        component: colonyContract
      },
      {
        path: 'team', //团队
        name: routeConfig.colonyTeam,
        component: colonyTeam
      },
      {
        path: 'plan', //计划实施
        name: routeConfig.colonyPlan,
        component: colonyPlan
      },
      {
        path: 'supply', //供应
        name: routeConfig.colonySupply,
        component: colonySupply
      },
      {
        path: 'purchase', //采购
        name: routeConfig.colonyPurchase,
        component: colonyPurchase
      },
      {
        path: 'admin', //行政
        name: routeConfig.colonyAdmin,
        component: colonyAdmin
      },
      {
        path: 'finance', //财经
        name: routeConfig.colonyFinance,
        component: colonyFinance
      },
      {
        path: 'weekly', //周报
        name: routeConfig.colonyWeekly,
        component: colonyWeekly
      }
    ]
  }
];

export default routes;
