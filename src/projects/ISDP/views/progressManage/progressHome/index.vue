/*
 * @Author: xia_wenxing/90111
 * @Date: 2019-04-19 09:48:53
 * @Last Modified by: xia_wenxing/90111
 * @Last Modified time: 2019-05-09 16:54:37
 */

<template>
  <div class="projectManage-home-wrap">
    <inside-progress :options="progressConfig"></inside-progress>
    <inside-report :options="reportConfig"
                   :remoteData="remoteData"></inside-report>
    <model-table class="inside-table"
                 :options="tableConfig"
                 :data="tableData"></model-table>
  </div>
</template>
<script>
import modelTable from '@/components/modelList/modelTable';
import insideProgress from '@ISDP/views/project/home/components/insideProgress';
import progressConfig from '@ISDP/views/project/home/config/progress.config';
// import reportConfig from '@ISDP/views/project/home/config/report.config';
import reportConfig from '@ISDP/views/project/home/config/report.echart.config';

import newReportConfig from './config/nReport.config';
import tableConfig from './config/table.config';
import otherConfig from './config/other';
import echartConfig from '@ISDP/assets/config/echart.config';

import tableIcon from '@ISDP/assets/images/common/common_chart_icon_sample.png';


const insideReport = () => import('@ISDP/views/project/home/components/insideReport');


const insideReportConfig = reportConfig.toJson();

insideReportConfig[0].reportGroup[0].echart.series[0].itemStyle = echartConfig.seriesItemStyleColor;
insideReportConfig[0].reportGroup[1].echart.series[0].itemStyle = echartConfig.seriesItemStyleColor;
insideReportConfig[0].reportGroup[2].echart.series[0].itemStyle = echartConfig.seriesItemStyleColor;


insideReportConfig.pop();
insideReportConfig.push({
  title: '外场施工进度图表',
  col: 24,
  reportGroup: [ newReportConfig ]
});
export default {
  components: {
    insideProgress,
    insideReport,
    modelTable
  },
  data(){
    return {
      progressConfig,
      reportConfig: insideReportConfig,
      tableConfig,
      tableData: [],
      remoteData: {}
    }
  },
  methods: {
    async getOutfieldConstructionChart(projectId){
      //       设计：  深化设计  design 
      //   实施：  设备安装  equipins 
      //   调试：  调试      debug 
      //   @@@ 
      //   设计：已完成=（外场实施子计划中已完成深化设计的点位/所有点位）*100%； 
      //   实施：已完成=（外场实施子计划中已完成硬件安装的点位/所有点位）*100%； 
      //   调试：已完成=（外场实施子计划中已完成上电调试的点位/所有点位）*100%；
      const {data,resultCode} = await this.$store.dispatch('ISDP/progressManage/getOutfieldConstructionChart',{
        projectId
      });
      if(data && +resultCode === 200){
        // Plannum  计划数
        // Finishnum  完成数
        const
          resultPlannum = [  ],    // 收集 Plannum
          resultFinishnum = [  ], // 收集Finishnum
          completionNum = [  ]; //完成率

        otherConfig.forEach((item) => {
          const plannum = data[item.name + 'Plannum'] || 0,
            finishnum = data[item.name + 'Finishnum'] || 0;

          resultPlannum.push(plannum);
          resultFinishnum.push(finishnum);
          completionNum.push((plannum && finishnum / plannum * 100).toFixed(0) || 0);
        });


        // table
        this.tableData = [ [ '<i class="icon-1"></i>',...resultPlannum ],[ '<i class="icon-2"></i>',...resultFinishnum ],[ `<img class="img-1" src="${ tableIcon }" alt=""/>`,...(completionNum.map((item) => item + '%')) ] ];

        const {designFinishnum,designPlannum,equipinsPlannum,equipinsFinishnum,debugPlannum,debugFinishnum} = data,
          {seriesDataLabelArr} = echartConfig;

        const
          designNum = designPlannum ? (designFinishnum / designPlannum * 100).toFixed(0) : 0,
          equipinsNum = equipinsPlannum ? (equipinsFinishnum / equipinsPlannum * 100).toFixed(0) : 0,
          debugNum = debugPlannum ? (debugFinishnum / debugPlannum * 100).toFixed(0) : 0;

        const maxVal = Math.max(...resultPlannum),
          resultInter = (maxVal / 10).toFixed(0);

        this.remoteData = Object.assign({},this.remoteData,
          {
            nReportInProgress: [ resultPlannum,resultFinishnum,completionNum ],
            // echart circle start
            projectStatus: [ [ {
              value: designFinishnum,
              name: +designNum + '%',
              label: seriesDataLabelArr[0]
            },{
              value: designPlannum || 1,
              name: '已完成',
              label: seriesDataLabelArr[1]
            } ] ],
            projectStatus1: [ [ {
              value: equipinsFinishnum,
              name: +equipinsNum + '%',
              label: seriesDataLabelArr[0]
            },{
              value: equipinsPlannum || 1,
              name: '已完成',
              label: seriesDataLabelArr[1]
            } ] ],
            projectStatus2: [ [ {
              value: debugFinishnum,
              name: +debugNum + '%',
              label: seriesDataLabelArr[0]
            },{
              value: debugPlannum || 1,
              name: '已完成',
              label: seriesDataLabelArr[1]
            } ] ],
            nReportInProgressKey: [ {
              key: 'yAxis',
              data: [
                {
                  type: 'value',
                  name: '',
                  min: 0,
                  max: +maxVal + +resultInter,
                  interval: +resultInter,
                  axisLabel: {
                    formatter: '{value}'
                  }
                },
                {
                  type: 'value',
                  name: '',
                  min: 0,
                  max: 100,
                  interval: 10,
                  axisLabel: {
                    formatter: '{value} %'
                  }
                }
              ]
            } ]
          }
        );
      }
    }
  },
  async created(){
    const {id} = this.$route.query;
    if(id){
      this.getOutfieldConstructionChart(id);
      await this.$store.dispatch('ISDP/project/getProjectDetail',{
        id
      });
    }

  }
}
</script>
<style lang="less" scoped>
  .projectManage-home-wrap {
    /deep/ .inside-table {
      .img-1 {
        margin: auto;
        display: block;
      }
      .icon-1,
      .icon-2 {
        @wid: 10px;
        width: @wid;
        height: @wid;
        margin: auto;
        display: block;
        background-color: #35425f;
      }
      .icon-2 {
        background-color: #f42020;
      }
    }
  }
</style>
