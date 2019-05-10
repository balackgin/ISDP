export default [
  {
    reportGroup: [
      {
        name: 'projectStatus',
        title: '设计',
        style: {
          width: '100%',
          height: '288px'
        },
        echart: {
          name: 'projectStatus',
          series: [
            {
              name: '设计',
              type: 'pie',
              center: [ '50%', '50%' ],
              radius: [ '55%', '70%' ],
              avoidLabelOverlap: true,
              hoverAnimation: false,
              hoverOffset: 4,
              label: {
                show: false
              },
              data: [
                {
                  value: 0,
                  name: '',
                  label: {
                    show: true,
                    position: 'center',
                    color: '#f00000',
                    fontSize: 32,
                    height: 20,
                    rich: {
                      height: 20
                    }
                  }
                },
                {
                  value: 0,
                  name: '',
                  label: {
                    show: true,
                    position: 'center',
                    color: '#3a3b3d',
                    fontSize: 14,
                    height: -6,
                    rich: {
                      height: -6
                    }
                  }
                }
              ]
            }
          ]
        }
      },
      {
        name: 'projectStatus1',
        title: '实施',
        style: {
          width: '100%',
          height: '288px'
        },
        echart: {
          name: 'projectStatus1',
          series: [
            {
              name: '实施',
              type: 'pie',
              center: [ '50%', '50%' ],
              radius: [ '55%', '70%' ],
              avoidLabelOverlap: true,
              hoverAnimation: false,
              hoverOffset: 4,
              label: {
                show: false
              },
              data: [
                {
                  value: 0,
                  name: '',
                  label: {
                    show: true,
                    position: 'center',
                    color: '#f00000',
                    fontSize: 32,
                    height: 20,
                    rich: {
                      height: 20
                    }
                  }
                },
                {
                  value: 0,
                  name: '',
                  label: {
                    show: true,
                    position: 'center',
                    color: '#3a3b3d',
                    fontSize: 14,
                    height: -6,
                    rich: {
                      height: -6
                    }
                  }
                }
              ]
            }
          ]
        }
      },
      {
        name: 'projectStatus2',
        title: '调试',
        style: {
          width: '100%',
          height: '288px'
        },
        echart: {
          name: 'projectStatus2',
          series: [
            {
              name: '调试',
              type: 'pie',
              center: [ '50%', '50%' ],
              radius: [ '55%', '70%' ],
              avoidLabelOverlap: true,
              hoverAnimation: false,
              hoverOffset: 4,
              label: {
                show: false
              },
              data: [
                {
                  value: 0,
                  name: '',
                  label: {
                    show: true,
                    position: 'center',
                    color: '#f00000',
                    fontSize: 32,
                    height: 20,
                    rich: {
                      height: 20
                    }
                  }
                },
                {
                  value: 100,
                  name: '',
                  label: {
                    show: true,
                    position: 'center',
                    color: '#3a3b3d',
                    fontSize: 14,
                    height: -6,
                    rich: {
                      height: -6
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    ]
  },
  {
    title: '仪表盘',
    reportGroup: [
      {
        title: '成本',
        name: 'projectStatus3',
        style: {
          width: '100%',
          height: '288px'
        },
        echart: {
          name: 'projectStatus3',
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
            confine: true
          },
          legend: {
            show: true,
            orient: 'vertical',
            align: 'left',
            top: 'bottom',
            x: 'right',
            data: [ '预算', '核算' ],
            itemWidth: 14,
            itemHeight: 14,
            borderRadius: 0
          },
          color: [ '#CED8D8', '#667086', '#FC5151', '#FFB83D' ],
          series: [
            {
              name: '成本',
              type: 'pie',
              center: [ '50%', '50%' ],
              radius: '55%',
              avoidLabelOverlap: true,
              legendHoverLink: false,
              hoverAnimation: false,
              label: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: 0,
                  name: '预算'
                },
                {
                  value: 0,
                  name: '核算'
                }
              ]
            }
          ]
        }
      },
      {
        title: '收入',
        name: 'projectStatus4',
        style: {
          width: '100%',
          height: '288px'
        },
        echart: {
          name: 'projectStatus4',
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)',
            confine: true
          },
          legend: {
            show: true,
            orient: 'vertical',
            align: 'left',
            top: 'bottom',
            x: 'right',
            data: [ '未确认', '已确认' ],
            itemWidth: 14,
            itemHeight: 14,
            borderRadius: 0
          },
          color: [ '#CED8D8', '#667086', '#FC5151', '#FFB83D' ],
          series: [
            {
              name: '收入',
              type: 'pie',
              center: [ '50%', '50%' ],
              radius: '55%',
              avoidLabelOverlap: true,
              label: {
                normal: {
                  show: false
                }
              },
              data: [
                {
                  value: 0,
                  name: '未确认'
                },
                {
                  value: 0,
                  name: '已确认'
                }
              ]
            }
          ]
        }
      },
      {
        title: '风险及问题',
        name: 'projectStatus5',
        style: {
          width: '100%',
          height: '288px'
        },
        echart: {
          tooltip: {},
          legend: {
            show: false,
            data: [ '预算分配', '实际开销' ],
            bottom: 0
          },
          radar: {
            triggerEvent: true,
            name: {
              textStyle: {
                color: '#fff',
                backgroundColor: '#999',
                borderRadius: 3,
                padding: [ 3, 5 ]
              }
            },
            indicator: [
              {
                name: '商务',
                max: 30
              },
              {
                name: '法务',
                max: 30
              },
              {
                name: '解决方案',
                max: 30
              },
              {
                name: '交付',
                max: 30
              },
              {
                name: '软件交付',
                max: 30
              },
              {
                name: '产品研发',
                max: 30
              },
              {
                name: '经营',
                max: 30
              },
              {
                name: '供应链',
                max: 30
              },
              {
                name: '采购',
                max: 30
              },
              {
                name: '交付运营',
                max: 30
              }
            ]
          },
          series: [
            {
              name: '风险及问题',
              type: 'radar',
              data: [
                {
                  value: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                  name: '计数项'
                },
                {
                  value: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
                  name: '超期时长'
                }
              ]
            }
          ]
        }
      },
      {
        title: '质量结果',
        name: 'projectStatus6',
        style: {
          width: '100%',
          height: '288px'
        }
      },
      {
        title: '自有资源',
        name: 'projectStatus7',
        style: {
          width: '100%',
          height: '288px'
        }
      },
      {
        title: '分包资源',
        name: 'projectStatus8',
        style: {
          width: '100%',
          height: '288px'
        }
      }
    ]
  }
];
