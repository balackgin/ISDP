<template>
  <div class="project-default-wrap">
    <inside-head class=" inside-head"
                 :data="detailData">
    </inside-head>
    <inside-progress class="inside-progress"
                     :options="progressConfig"></inside-progress>
    <inside-report class="report-wrap"
                   :options="reportConfig"
                   :remoteData="reportRemoteData"></inside-report>
    <!-- <inside-notice class="inside-notice"></inside-notice> -->
  </div>
</template>
<script>
import {mapState} from 'vuex';
import insideHead from './components/insideHead';
import insideProgress from './components/insideProgress';
// import insideNotice from './components/insideNotice';   // 项目通知
const insideReport = () => import('./components/insideReport');
import progressConfig from './config/progress.config';
import reportConfig from './config/report.echart.config';
import echartConfig from '@ISDP/assets/config/echart.config';
// import echartConfig from '@ISDP/assets/config/echart.config';

const reportConfigCopy = reportConfig.toJson();

reportConfigCopy[0].reportGroup[0].echart.series[0].itemStyle = echartConfig.seriesItemStyleColor;
reportConfigCopy[0].reportGroup[1].echart.series[0].itemStyle = echartConfig.seriesItemStyleColor;
reportConfigCopy[0].reportGroup[2].echart.series[0].itemStyle = echartConfig.seriesItemStyleColor;

export default {
  components: {
    insideHead,
    insideProgress,
    insideReport
    // insideNotice
  },
  data(){
    return {
      progressConfig: progressConfig.toJson(),
      reportConfig: reportConfigCopy,
      detailData: null,
      reportRemoteData: {}
    }
  },
  computed: {
    ...mapState({
      projectDefaultID: (state) => state.ISDP.project.projectDefaultID
    })
  },
  methods: {
    async getDetail(id){
      if(!id){
        return false;
      }
      const {data,resultCode} =  await this.$store.dispatch('ISDP/project/getProjectDetail',{id});
      if(data && resultCode && resultCode.includes('200')){
        data.isDefault = this.projectDefaultID === id;
        this.detailData = data;
      }
    },
    async getCost(projectId){
      if(!projectId){
        return false;
      }
      const {data = {}} =  await this.$store.dispatch('ISDP/project/getCost',{projectId}) || {};
      this.reportRemoteData = Object.assign({},this.reportRemoteData,{
        projectStatus3: [ [ {
          value: data.approximate || 0,
          name: '预算'
        },{
          value: data.collectValue || 0,
          name: '核算'
        } ] ]
      });

    },
    async getRiskProblem(projectId){
      if(!projectId){
        return false;
      }
      const {data = {}} =   await this.$store.dispatch('ISDP/project/getRiskProblem',{projectId}) || {},
        {riskCountMap = {},riskTimeMap = {}} = data;

      const matchArr  = [ 'BUSINESS','LEGAL','SOLUTION','DELIVERY','SOFTWARE_DELIVERY','PROD_DESIGN','MANAGING','SUPPLY_CHAIN','PURCHASE','DELIVERY_OPERATE' ],
        // 商务  法务  解决方案  交付  软件交付  产品研发  经营  供应链  采购  交付运营
        matchCNObj = {
          BUSINESS: '商务',
          LEGAL: '法务',
          SOLUTION: '解决方案',
          DELIVERY: '交付',
          SOFTWARE_DELIVERY: '软件交付',
          PROD_DESIGN: '产品研发',
          MANAGING: '经营',
          SUPPLY_CHAIN: '供应链',
          PURCHASE: '采购',
          DELIVERY_OPERATE: '交付运营'
        },
        addArr = [],
        resultArr = (args,bool) => {
          const collectArr = [];
          if(bool){
            matchArr.forEach((item,idx) => {
              const val = args[item];
              (+val || idx < 3) && collectArr.push(val) && addArr.push(item);
              // 前三个必须显示 不然奇丑
            });
          }else{
            matchArr.forEach((item) => {
              if(addArr.includes(item)){
                const val = args[item];
                collectArr.push(val);
              }
            });
          }
          return collectArr;
        },
        riskCountArr =  resultArr(riskCountMap,1),
        riskTimeArr = resultArr(riskTimeMap),
        maxNum = Math.max(...riskCountArr,...riskTimeArr,0) + 20;

      this.reportRemoteData = Object.assign({},this.reportRemoteData,{
        projectStatus5: [ [ {
          value: riskCountArr,
          name: '计数项'
        },{
          value: riskTimeArr,
          name: '超期时长'
        } ] ],
        projectStatus5Key: addArr.length && [ {
          key: 'radar',
          data: {
            name: {
              'textStyle': {
                'color': '#fff',
                'backgroundColor': '#999',
                'borderRadius': 3,
                'padding': [ 3, 5 ]
              }
            },
            indicator: addArr.map((item) => ({
              name: matchCNObj[item],
              max: maxNum
            }))
          }
        } ]
      });
    },
    async getOutfieldConstructionChart(projectId){
      //       设计：  深化设计  design 
      //   实施：  设备安装  equipins 
      //   调试：  调试      debug 
      //   @@@ 
      //   设计：已完成=（外场实施子计划中已完成深化设计的点位/所有点位）*100%； 
      //   实施：已完成=（外场实施子计划中已完成硬件安装的点位/所有点位）*100%； 
      //   调试：已完成=（外场实施子计划中已完成上电调试的点位/所有点位）*100%；
      if(!projectId){
        return false;
      }

      const {data,resultCode} = await this.$store.dispatch('ISDP/progressManage/getOutfieldConstructionChart',{
        projectId
      });
      if(data && +resultCode === 200){
        // Plannum  计划数
        // Finishnum  完成数

        const {designFinishnum,designPlannum,equipinsPlannum,equipinsFinishnum,debugPlannum,debugFinishnum} = data,
          {seriesDataLabelArr} = echartConfig;

        const
          designNum = designPlannum ? (designFinishnum / designPlannum * 100).toFixed() : 0,
          equipinsNum = equipinsPlannum ? (equipinsFinishnum / equipinsPlannum * 100).toFixed() : 0,
          debugNum = debugPlannum ? (debugFinishnum / debugPlannum * 100).toFixed() : 0;


        this.reportRemoteData = Object.assign({},this.reportRemoteData,
          {
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
            } ] ]
          }
        );
      }
    }
  },
  async created(){
    const {$route} = this,
      {type,id: routeID} = $route.query;
    let id = type === 'detail' && routeID;

    if(!id){
      await this.$store.dispatch('ISDP/project/getProjectForDefault');
      id = this.projectDefaultID;

      this.$router.push({
        name: $route.name,
        query: {
          id
        }
      });
    }else{
      await this.$store.dispatch('ISDP/common/getMenuList',{
        projectId: id
      });
    }
    if(id){
      this.getCost(id);
      this.getRiskProblem(id);
      this.getDetail(id);
      this.getOutfieldConstructionChart(id);
    }

  }
}
</script>

<style lang="less" scoped>
  .project-default-wrap {
    padding-bottom: 20px;
    .inside-head {
      margin: 20px 0;
    }
    .report-wrap {
      margin-top: 36px;
    }
    .inside-notice {
      margin-top: 32px;
    }
  }
</style>
