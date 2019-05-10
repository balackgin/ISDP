<template>
  <div class="survey-wrap">
    <div class="milepost-title detail-title-wrap">
      <span class="txt">风险项及问题</span>
      <router-link :to="'/ISDP/project/detail/whole?id='+ $route.query.id"
                   class="txt-more">更多</router-link>
    </div>
    <model-list :options="riskConfig"
                @callback="callback"
                :fns="tableActions"
                :data="listData"></model-list>
    <risk-dialog :show="dialogShow"
                 :currentData="currentData"
                 @callback="callback"></risk-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import modelList from '@/components/modelList';
import riskDialog from './wholeDialog';
import riskConfig from './config/risk.config.json';
// const IMPORTANCE_MAP = {
//   commonly: '一般',
//   importance: '重要',
//   urgent: '紧急',
//   urgentImportance: '紧急重要'
// };
export default {
  components: {
    modelList,
    riskDialog
  },
  data() {
    return {
      riskConfig,
      listData: [],
      pagination: {
        pageCount: 3,
        pageNum: 1,
        total: 0
      },

      currentData: {},
      dialogShow: false,

      tableActions: {
        deviation(value){
          return +value > 0 ? `延后${ value }天` :  +value < 0 &&  `提前${ Math.abs(+value) }天` || value;
        }
      }
    };
  },
  computed: {
    ...mapState({
      projectManager: (state) => state.ISDPOld.project.projectManager
    })
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    async getRiskList() {
      const { pageNum, pageCount } = this.pagination;

      const { data } = await this.$store.dispatch(
        'ISDPOld/project/getRiskList',
        {
          pageNum,
          pageCount,
          obj: {
            projectId: this.$route.query.id,
            problemDesc: '',
            status: '',
            importanceLevel: '',
            submitPerson: '',
            planStartDate: '',
            planEndDate: ''
          },
          sortColumn: 'importanceLevel',
          sortType: 'desc'
        }
      );
      if(data) {
        this.listData = (data.content || []).map((item) => {
          const {deviation} = item;
          item.deviation = +deviation > 0 ? `延后${ deviation }天` :  +deviation < 0 &&  `提前${ Math.abs(+deviation) }天` || deviation;
          return item;
        });
      }
    },
    handleDBLClickForRow(rowData){
      if(this.projectManager){
        this.currentData = Object.assign({},rowData);
        this.dialogShow = true;
      }

    },
    beforeClose(){
      this.getRiskList();
      this.dialogShow = false;
    },
    updateList(){
      this.beforeClose();
    }
  },
  async created() {
    await this.getRiskList();
  }
};
</script>
