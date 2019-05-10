const managementOutsourcer = () =>
    import('@/projects/management/views/outsourcer/index'),
  managementOutsourcerApply = () =>
    import('@/projects/management/views/outsourcer/apply'),
  managementOutsourcerLibrary = () =>
    import('@/projects/management/views/outsourcer/libraryList');
export default [
  {
    path: 'outsourcer',
    component: managementOutsourcer,
    children: [
      {
        path: '',
        name: 'managementOutsourcerHome',
        redirect: {
          name: 'managementOutsourcerApply'
        }
      },
      {
        path: 'apply',
        name: 'managementOutsourcerApply',
        component: managementOutsourcerApply
      },
      {
        path: 'library',
        name: 'managementOutsourcerLibrary',
        component: managementOutsourcerLibrary
      }
    ]
  }
];
