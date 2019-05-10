export default {
  search: {
    formItems: [ {
      label: '项目名称',
      prop: 'contractName'
    },
    {
      label: '项目编号',
      prop: 'contractNo'
    },
    {
      label: '项目经理',
      prop: 'projectManagerNo',
      type: 'select',
      formItemOpts: {
        remote: true,
        filterable: true,
        clearable: true,
        select: []
      }
    }
    ],
    btns: [ {
      text: '搜索',
      type: 'danger',
      name: 'search'
    } ]
  },
  table: {
    name: 'project-table-all',
    tableOpts: {
      theme: 'isdp',
      autoHeight: true,
      highlightCurrentRow: true,
      emptyText: '',
      height: 304
    },
    columns: [ {
      label: '项目编号',
      prop: 'contractNo',
      type: 'link',
      columnOpts: {
        align: 'center',
        width: 160
      }
    },
    {
      label: '项目名称',
      prop: 'contractName',
      columnOpts: {
        align: 'center',
        minWidth: 240
      }
    },
    {
      label: '项目级别',
      prop: 'projectLevel',
      columnOpts: {
        align: 'center',
        minWidth: 130
      }
    },
    {
      label: '区域办',
      prop: 'projectProvince',
      columnOpts: {
        align: 'center',
        width: 105
      }
    },
    {
      label: '项目经理',
      prop: 'projectManagerName',
      columnOpts: {
        align: 'center',
        width: 120
      }
    },
    {
      label: '行业',
      prop: 'industryType',
      columnOpts: {
        align: 'center',
        width: 96
      }
    },
    {
      label: '交付场景',
      prop: 'deliveryScenario',
      columnOpts: {
        align: 'center',
        width: 106
      }
    },
    {
      label: '区域PMO',
      prop: 'areapmo',
      columnOpts: {
        align: 'center',
        width: 120
      }
    },
    {
      label: '阶段',
      prop: 'projectPhase',
      type: 'obj',
      columnOpts: {
        align: 'center',
        obj: {
          0: '项目启动',
          1: '小批量',
          2: '大批量',
          3: '项目收尾'
        },
        width: 120
      }
    },
    {
      label: '关闭',
      prop: 'isClosed',
      type: 'obj',
      columnOpts: {
        align: 'center',
        width: 96,
        obj: {
          1: '是',
          0: '否'
        }
      }
    },
    {
      label: '项目交付时间',
      prop: 'deliverTime',
      // type: 'obj',
      columnOpts: {
        align: 'center',
        minWidth: 160
      }
    },
    {
      label: '状态',
      prop: 'projectStatus',
      type: 'obj',
      columnOpts: {
        align: 'center',
        obj: {
          DELAY: '延期',
          NORMAL: '正常'
        },
        width: 96
      }
    },
    {
      label: '操作',
      prop: 'operate',
      type: 'action-icons',
      columnOpts: {
        width: 120,
        fixed: 'right',
        align: 'center',
        icons: [ {
          name: 'saveProjectForDefault',
          text: '设为默认'
        } ]
      }
    }
    ]
  },
  projectLevel: {
    label: '交付等级',
    list: [ {
      label: '全部',
      value: ''
    },
    {
      label: 'S级',
      value: 'S'
    },
    {
      label: 'A级',
      value: 'A'
    },
    {
      label: 'B级',
      value: 'B'
    },
    {
      label: 'C级',
      value: 'C'
    }
    ]
  },
  projectStatus: {
    label: '交付阶段',
    list: [ {
      label: '全部',
      value: ''
    },
    {
      label: '项目启动',
      value: '项目启动'
    },
    {
      label: '小批量',
      value: '小批量'
    },
    {
      label: '大批量',
      value: '大批量'
    },
    {
      label: '项目收尾',
      value: '项目收尾'
    }
    ]
  }
};