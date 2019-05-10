const routeTem = () => import('@/components/routeTem'),
  Detail = () => import('@/projects/outsourcer/views/project/detail/index'),
  List = () => import('@/projects/outsourcer/views/project/list'),
  Daily = () => import('@/projects/outsourcer/views/project/detail/daily'),
  Task = () => import('@/projects/outsourcer/views/project/detail/task'),
  Point = () => import('@/projects/outsourcer/views/project/detail/point');
const route = [
  {
    path: 'project',
    component: routeTem,
    children: [
      {
        path: '',
        name: 'outsourcerProject',
        component: List,
        redirect: {
          name: 'outsourcerProjectList'
        }
      },
      {
        path: 'list',
        name: 'outsourcerProjectList',
        component: List
      },
      {
        path: 'detail',
        component: Detail,
        children: [
          {
            path: '',
            name: 'outsourcerProjectDetail',
            redirect: {
              name: 'outsourcerProjectDetailPoint'
            }
          },
          {
            path: 'point',
            name: 'outsourcerProjectDetailPoint',
            component: Point
          },
          {
            path: 'daily',
            name: 'outsourcerProjectDetailDaily',
            component: Daily
          },
          {
            path: 'task',
            name: 'outsourcerProjectDetailTask',
            component: Task
          }
        ]
      }
    ]
  }
];

export default route;
