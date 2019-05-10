// const users = () => import('@/projects/sys/views/permission/users');
// const groups = () => import('@/projects/sys/views/permission/groups');
const roles = () => import('@/projects/sys/views/permission/roles');
// const views = () => import('@/projects/sys/views/permission/views');
// const functions = () => import('@/projects/sys/views/permission/functions');
// const permission = () => import('@/projects/sys/views/permission/permission');
export default [ {
  path: 'permission/roles',
  name: 'permissionRoles',
  component: roles
}
  //  {
  //   path: 'permission/users',
  //   name: 'sysUsers',
  //   component: users
  // },
  // {
  //   path: 'permission/groups',
  //   name: 'groups',
  //   component: groups
  // },

  // {
  //   path: 'permission/views',
  //   name: 'views',
  //   component: views
  // },
  // {
  //   path: 'permission/functions',
  //   name: 'functions',
  //   component: functions
  // },
  // {
  //   path: 'permission/permission',
  //   name: 'permission',
  //   component: permission
  // }
]