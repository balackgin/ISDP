const outsourcerDetail = () =>
  import('@/projects/management/views/outsourcer/detail');
export default [
  {
    path: 'outsourcer/detail',
    name: 'managementOutsourcerDetail',
    component: outsourcerDetail
  }
];
