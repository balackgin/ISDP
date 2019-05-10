<template>
  <div class="project-report-wrap">
    <p class="line-text title mt-1">
      <span class="text">报表</span>
    </p>
    <el-row class="report-row-box mt-2"
            :gutter="30">
      <el-col :span="8"
              v-for="item of echartConfig"
              v-if="!item.hide"
              :key="item.title">
        <model-echart class="mt-2"
                      :options="item"
                      :remoteData="reportData"></model-echart>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import Echart from 'echarts';
// import modelEchart from '@/components/modelEchart';
import echartConfig from './config/report.config.json';
const modelEchart = () => import('@/components/modelEchart');
export default {
  components: {
    modelEchart
  },
  data(){
    return {
      echartConfig,
      reportData: {},
      updatedID: ''
    }
  },
  methods: {
    async getReportForContract(){
      let {data} = await this.$store.dispatch('ISDPOld/project/getReportForContract');
      if(data){
        let arr = Object.keys(data).map((item) => ({
          name: item,
          value: +data[item] || 0
        }));
        this.reportData = Object.assign({},this.reportData,{contractStatus: arr});
      }

    },
    async getReportForProjectLevel(){
      let {data} =  await this.$store.dispatch('ISDPOld/project/getReportForProjectLevel');
      if(data){
        let arr = Object.keys(data).map((item) => ({
          name: item !== 'other' ? item + '级' :  item,
          value: +data[item] || 0
        }));
        this.reportData = Object.assign({},this.reportData,{projectLevel: arr});
      }
    },
    async getReportForProjectStatus(){
      let {data} =  await this.$store.dispatch('ISDPOld/project/getReportForProjectStatus');
      if(data){
        const arr = [ {
          name: '正常',
          value: +data.NORMAL || 0
        },{
          name: '延后',
          value: +data.DELAY || 0
        } ];
        this.reportData = Object.assign({},this.reportData,{projectStatus: arr});
      }
    }
  },
  async created () {
    await this.getReportForContract();
    await this.getReportForProjectLevel();
    await this.getReportForProjectStatus();
    this.updatedID = Date.now();
  }
}
</script>

<style lang="less" scoped>
  .project-report-wrap {
    .title {
      font-size: 16px;
      font-weight: 700;
    }
    .report-row-box {
      .row-box-title {
        padding-left: 5px;
        border-left: 4px solid #d50000;
        font-size: 14px;
        line-height: 1;
        font-weight: 700;
      }
    }
  }
</style>
