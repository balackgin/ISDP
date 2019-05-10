<template>
  <div class="project-report-wrap">
    <div class="flex report-box">
      <div class="flex-item">
        <p class="title">
          <span class="txt">项目交付进度</span>
        </p>
        <div class="echart-box">
          <model-echart :options="processConfig"
                        class="process"></model-echart>
        </div>
      </div>
      <div class="flex-item">
        <p class="title">
          <span class="txt">项目交付立项情况</span>
        </p>
        <div class="echart-box">
          <model-echart :options="statusConfig"
                        class="status"></model-echart>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Echart from 'echarts';
import modelEchart from '@/components/modelEchart';
export default {
  components: {
    modelEchart
  },
  data(){
    return {
      processConfig: {
        ele: '.process',
        legend: {
          data: [ '提前','正常','延后' ]
        },
        color: [ '#FDB45C','#46BFBD','#F7464A' ],
        series: {
          data: [ {
            value: '300',
            name: '提前'
          },{
            value: '100',
            name: '正常'
          },{
            value: '50',
            name: '延后'
          } ]
        }
      },
      statusConfig: {
        ele: '.status',
        legend: [],
        color: [ '#FDB45C','#46BFBD','#F7464A' ],
        series: {
          data: [ {
            value: '300',
            name: '提前'
          },{
            value: '100',
            name: '正常'
          },{
            value: '50',
            name: '延后'
          } ]
        }
      }
    }
  }
  // methods: {
  //   echart(args,bool){
  //     let ele = document.querySelector(args);
  //     if(!ele){
  //       return false;
  //     }
  //     let myEchart = Echart.init(ele);
  //     // www.echartsjs.com/option.html#series-pie.hoverOffset
  //     myEchart.setOption({
  //       tooltip: {
  //         trigger: 'item',
  //         formatter: '{b}: {c}',
  //         // formatter: '{a}<br/>{b}: {c} ({d})',
  //         confine: true
  //       },
  //       legend: {
  //         orient: 'vertical',
  //         x: 'left',
  //         data: bool ? [] : [ '提前','正常','延后' ]
  //       },
  //       color: [ '#FDB45C','#46BFBD','#F7464A' ],
  //       series: [ {
  //         name: '',
  //         type: 'pie',
  //         radius: [ '50%','80%' ],
  //         avoidLabelOverlap: false,
  //         hoverOffset: 2,
  //         label: {
  //           normal: {
  //             show: false,
  //             position: 'inside'
  //           },
  //           emphasis: {
  //             show: false,
  //             textStyle: {
  //               fontSize: '30',
  //               fontWeight: 'bold'
  //             }
  //           }
  //         },
  //         labelLine: {
  //           normal: {
  //             show: false
  //           }
  //         },
  //         data: [ {
  //           value: '300',
  //           name: '提前'
  //         },{
  //           value: '100',
  //           name: '正常'
  //         },{
  //           value: '50',
  //           name: '延后'
  //         } ],
  //         itemStyle: {
  //           borderWidth: 4,
  //           borderColor: '#fff'
  //         }
  //       }
  //       ]
  //     },true);
  //     return myEchart;
  //   }
  // },
  // mounted () {
  //   let progress = this.echart('.progress'),
  //     status = this.echart('.status',1);

  //   window.addEventListener('resize',() => {
  //     progress && progress.resize();
  //     status && status.resize();
  //   })
  // }
}
</script>

<style lang="less" scoped>
  .project-report-wrap {
    .report-box {
      .flex-item {
        &:first-child {
          padding-right: 20px;
        }
        &:last-child {
          padding-left: 20px;
        }
      }
      .title {
        margin: 10px auto 26px;
        color: #333;
        font-size: 16px;
        font-weight: 700;
        overflow: hidden;
        .txt {
          position: relative;
          &::after {
            content: '';
            position: absolute;
            left: 100%;
            bottom: 8px;
            margin-left: 20px;
            width: 100vw;
            height: 1px;
            background-color: #ddd;
            display: block;
          }
        }
      }
      .echart-box {
        width: 300px;
        height: 200px;
        @media (min-width: 1200px) {
          width: 100%;
          height: 360px;
        }
      }
    }
  }
</style>
