import echarts from 'echarts';

export default {
  echartConfig: {
    name: 'projectLevel',
    title: '级别数据分析',
    echart: {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: ''
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        data: [ 'S级', 'A级', 'B级', 'C级' ],
        axisLabel: {
          inside: false
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      },
      yAxis: [ {
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      } ],
      series: [ {
        type: 'bar',
        barWidth: '30px',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [ {
              offset: 0,
              color: '#fe2c2c'
            }, {
              offset: 1,
              color: '#f8cdcd'
            } ])
          },
          emphasis: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [ {
              offset: 0,
              color: '#fe2c2c'
            }, {
              offset: 1,
              color: '#fe2c2c'
            } ])
          }
        },
        data: [ 0, 0, 0, 0, 0 ]
      } ]
    }
  },
  levelConfig: {
    name: 'project-all-le',
    title: '历年项目交付数量',
    echart: {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: ''
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        data: [ '2018', '2019' ],
        axisTick: {
          show: false
        },
        axisLabel: {
          inside: false
        },
        axisLine: {
          show: false
        }
      },
      yAxis: [ {
        axisTick: {
          show: false
        },
        axisLine: {
          show: false
        }
      } ],
      series: [ {
        type: 'bar',
        barWidth: '30px',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [ {
              offset: 0,
              color: '#495570'
            }, {
              offset: 1,
              color: '#cfd2d7'
            } ])
          },
          emphasis: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [ {
              offset: 0,
              color: '#495570'
            }, {
              offset: 1,
              color: '#495570'
            } ])
          }
        },
        data: [ 0, 0, 0, 0, 0 ]
      } ]
    }
  }
}