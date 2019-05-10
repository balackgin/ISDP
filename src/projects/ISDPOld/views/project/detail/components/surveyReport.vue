<template>
  <div class="report-wrap">
    <div class="detail-title-wrap">
      <span class="txt">仪表盘</span>
    </div>
    <el-row :gutter="30">
      <el-col :span="8"
              class="mt-1"
              v-for="item of charConfig"
              :key="item.name"
              v-if="!item.hide">
        <model-echart :options="item"
                      :remoteData="echartData"></model-echart>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// import modelEchart from '@/components/modelEchart';
import charConfig from '../config/echats.config.json';
const modelEchart = () => import('@/components/modelEchart');
// const IMPORTANCE_MAP = {
//   commonly: '一般',
//   importance: '重要',
//   urgent: '紧急',
//   urgentImportance: '紧急重要'
// };
export default {
  components: {
    modelEchart
  },
  data() {
    return {
      charConfig,
      echartData: {},
      updatedID: ''
    };
  },
  methods: {
    async getTotalInfo() {
      const { data } = await this.$store.dispatch('ISDPOld/project/getTotalInfo', {
        projectId: this.$route.query.id
      });
      let obj = {};
      obj.projectNums = [ {
        name: 'open',
        value: +data.open || 0
      },
      {
        name: 'Pending',
        value: +data.Pending || 0
      },
      {
        name: 'ReOpen',
        value: +data.ReOpen || 0
      },
      {
        name: 'Validated',
        value: +data.Validated || 0
      }
      ];
      obj.projectStatusNums = [ {
        name: '紧急重要',
        value: +data.urgentImportance || 0
      },{
        name: '紧急',
        value: +data.urgent || 0
      },{
        name: '重要',
        value: +data.importance || 0
      },{
        name: '一般',
        value: +data.commonly || 0
      } ]
      this.echartData = Object.assign({},obj);
    }
  },
  async created() {
    await this.getTotalInfo();
    this.updatedID = Date.now();
  }
};
</script>
