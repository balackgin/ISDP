<template>
  <div class="myEchart-box"
       :key="options.name || Date.now()+''"
       :data-remote="remoteData">
    <p class="echart-title">{{options.title}}</p>
    <div class="echart-box"
         :style="options.style"
         :class="[options.name]"
         v-if="options.echart"
         @click="handleClickForEchartBox">
    </div>
    <div v-else
         :style="options.style"
         class="text-center">
      <img class="not-echart-img"
           src="@ISDP/assets/images/common/common_img_wu.png"
           alt="">
    </div>
  </div>
</template>
<script>
import Echart from 'echarts';
export default {
  name: 'modelEchart',
  data() {
    return {
      myEchart: null
    };
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    echart() {
      const { options,remoteData = {} } = this,
        optsName = options.name;
      let ele = document.querySelector(optsName ? '.' + optsName : '.myEchart-box');
      if (!ele) {
        return false;
      }
      let myEchart = new Echart.init(ele);
      // www.echartsjs.com/option.html#series-pie.hoverOffset
      const  option = options.echart || options;

      const resultData = remoteData[optsName];
      if(resultData && optsName){
        resultData.forEach((item,idx) => {
          option.series[idx].data = item;
        });
      }
      const resultKeyData = remoteData[`${ optsName }Key`];
      //  {
      //   key: '',
      //   data: '{}/[]'
      // };
      if(resultKeyData){
        resultKeyData.forEach((item) => {
          const {key,data} = item;
          option[key] && data ? option[key] = data : '';
        });
      }

      myEchart.setOption(option);
      myEchart.on('click',(args) => {
        this.callback('handleClickForEchart',args);

        const {seriesName} = args;
        if([ '设计','实施','调试' ].includes(seriesName)){  //外场实施子计划
          this.$router.push({
            name: 'ISDPProgressExternalField',
            query: this.$route.query
          });
        }else if([ '成本','收入' ].includes(seriesName)){  // 预算
          this.$router.push({
            name: 'ISDPOperationBudget',
            query: this.$route.query
          });
        }else if([ '风险及问题' ].includes(seriesName)){   // 风险及问题维护
          this.$router.push({
            name: 'ISDPRiskMaintenance',
            query: this.$route.query
          });
        }
      });
      return myEchart;
    },
    handleClickForEchartBox(){
      const {options} = this;
      if(options.title === '风险及问题'){
        this.$router.push({
          name: 'ISDPRiskMaintenance',
          query: this.$route.query
        });
      }
    }
  },
  mounted() {
    this.myEchart = this.echart();
    window.addEventListener('resize', () => {
      this.myEchart && this.myEchart.resize();
    });
  },
  updated(){
    this.echart();
  },
  props: {
    options: {
      type: Object,
      required: true,
      default() {
        return {};
      }
    },
    remoteData: {
      type: Object,
      default(){
        return {}
      }
    }
  }
};
</script>
<style lang="less" scoped>
  .myEchart-box {
    width: 100%;
    .echart-box {
      width: 100%;
      height: 20vw;
    }
    .echart-title {
      padding-left: 5px;
      border-left: 4px solid #d50000;
      font-size: 14px;
      line-height: 1;
      font-weight: 700;
    }
    .not-echart-img {
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>
