import routeConfig from '@/route/config/oldISDP.config';
const projectDetail = () => import('@/projects/ISDPOld/views/project/detail'),
  projectSurvey = () => import('@/projects/ISDPOld/views/project/detail/survey'),
  projectWhole = () => import('@/projects/ISDPOld/views/project/detail/whole'),
  projectManage = () => import('@/projects/ISDPOld/views/project/detail/manage'),
  projectContract = () =>
    import('@/projects/ISDPOld/views/project/detail/contract'),
  projectTeam = () => import('@/projects/ISDPOld/views/project/detail/team'),
  projectPlan = () => import('@/projects/ISDPOld/views/project/detail/plan'),
  // projectPlan1 = () => import('@/projects/ISDPOld/views/project/detail/plan1'),
  projectSupply = () => import('@/projects/ISDPOld/views/project/detail/supply'),
  projectPurchase = () =>
    import('@/projects/ISDPOld/views/project/detail/purchase'),
  projectAdmin = () => import('@/projects/ISDPOld/views/project/detail/admin'),
  projectFinance = () => import('@/projects/ISDPOld/views/project/detail/finance'),
  projectWeekly = () => import('@/projects/ISDPOld/views/project/detail/weekly');
const routes = [
  {
    path: 'project/detail',
    component: projectDetail,
    children: [
      {
        path: '',
        name: routeConfig.projectDetail,
        redirect: {
          name: routeConfig.projectSurvey
        }
      },
      {
        path: 'survey', //概况
        name: routeConfig.projectSurvey,
        component: projectSurvey
      },
      {
        path: 'whole',
        name: routeConfig.projectWhole,
        component: projectWhole
      },
      {
        path: 'manage', //管理
        name: routeConfig.projectManage,
        component: projectManage
      },
      {
        path: 'contract', //合同
        name: routeConfig.projectContract,
        component: projectContract
      },
      {
        path: 'team', //团队
        name: routeConfig.projectTeam,
        component: projectTeam
      },
      {
        path: 'plan', //计划实施
        name: routeConfig.projectPlan,
        component: projectPlan
      },
      {
        path: 'supply', //供应
        name: routeConfig.projectSupply,
        component: projectSupply
      },
      {
        path: 'purchase', //采购
        name: routeConfig.projectPurchase,
        component: projectPurchase
      },
      {
        path: 'admin', //行政
        name: routeConfig.projectAdmin,
        component: projectAdmin
      },
      {
        path: 'finance', //财经
        name: routeConfig.projectFinance,
        component: projectFinance
      },
      {
        path: 'weekly', //周报
        name: routeConfig.projectWeekly,
        component: projectWeekly
      }
    ]
  }
];

export default routes;
