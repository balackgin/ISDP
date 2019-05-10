const Login = () => import('@/projects/outsourcer/views/user/index');

const route = [
  {
    path: 'login',
    name: 'outsourcerLogin',
    component: Login
  }
];

export default route;
