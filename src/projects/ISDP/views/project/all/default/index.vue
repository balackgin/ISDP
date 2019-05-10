<template>
  <div class="default-project">
    <template v-if="$route.query.type !== 'detail'">
      <model-search class="search-item"
                    :options="defaultConfig.search"
                    :form="formList"
                    :remoteData="remoteData"
                    @callback="callback"></model-search>
      <div class="default-labels">
        <label-items :data="defaultConfig.projectLevel"
                     @callback="callbackForLevel"></label-items>
        <label-items :className="'project-status'"
                     :data="defaultConfig.projectStatus"
                     @callback="callbackForStage"></label-items>
      </div>
      <model-table class="new-table-style"
                   :options="defaultConfig.table"
                   :data="projectList"
                   :pagination="pagination"
                   @callback="callback"></model-table>
      <div class="echart">
        <div class="chart-item">
          <!-- {{levelData}} -->
          <model-echart :options="echartConfig"
                        :remoteData="remoteData"></model-echart>
          <span class="line"></span>
        </div>
        <div class="chart-item">
          <model-echart :options="levelConfig"
                        :remoteData="remoteData"></model-echart>
        </div>
      </div>
    </template>
    <template v-else>
      <project-home :projectId="projectId"></project-home>
    </template>

  </div>

</template>

<script>
import { mapState } from  'vuex';
import labelItems from './components/labelItems';
import modelSearch from '@/components/modelList/modelSearch';
import modelTable from '@/components/modelList/modelTable';
// import modelEchart from '@/components/modelEchart';
import projectHome from '@ISDP/views/project/home';

import echartConfig from './config/echart.config.js';
import defaultConfig from './config/default.config.js';
const modelEchart = () => import('@/components/modelEchart');
let timer = '';
export default {
  components: {
    labelItems,
    modelSearch,
    modelTable,
    modelEchart,
    projectHome
  },
  data(){
    return {
      ...echartConfig,
      defaultConfig,
      projectList: [],
      remoteData: {
        projectManagerNo: []
      },
      formList: {
        projectLevel: '',
        projectPhase: '',
        contractName: '',
        contractNo: ''
      },
      projectId: null,
      pagination: {
        theme: 'isdp',
        pageNum: 1,
        pageCount: 5,
        total: 0,
        layout: 'total,prev,pager,next,sizes,jumper'
      }
    }
  },
  computed: {
    ...mapState({
      projectDefaultID(state) {
        return state.ISDP.project.projectDefaultID || '';
      }
    })
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    handleClickForTypeLink(data){
      const {id} = data,
        {$route} = this;
      if(!id){
        this.$elTooltip({
          message: '该项目未找到ID!',
          type: 'error'
        });
        return false;
      }
      this.projectId = id;
      this.$changeProject(id,{
        name: $route.name,
        query: {
          id,
          type: 'detail'
        }
      });
      // this.$store.dispatch('ISDP/common/getMenuList',{
      //   projectId: id
      // });
      // $router.push({
      //   name: $route.name,
      //   query: {
      //     id,
      //     type: 'detail'
      //   }
      // });
    },
    callbackForLevel(fnName,...args){
      this[fnName + 'ForLevel'] && this[fnName + 'ForLevel'](...args);
    },
    callbackForStage(fnName,...args){
      this[fnName + 'ForStage'] && this[fnName + 'ForStage'](...args);
    },
    clickForLabelItemForLevel(row) {
      if(this.formList.projectLevel === row.value) return;
      this.formList.projectLevel = row.value;
      this.pagination.pageNum = 1;
      this.getProjectAllList();
      this.getStatisticsLevel();
      this.getStatisticsDeliver();
    },
    clickForLabelItemForStage(row) {
      if(row.value === this.formList.projectPhase) return;
      this.formList.projectPhase = row.value;
      this.pagination.pageNum = 1;
      this.getProjectAllList();
      this.getStatisticsLevel();
      this.getStatisticsDeliver();
    },
    handleClickForSubmit(opts) {
      const { name } = opts;
      if(name === 'search') {
        this.getProjectAllList();
        this.getStatisticsLevel();
        this.getStatisticsDeliver();
      }
    },
    async getStatisticsLevel() {
      const { data, resultCode = '' } = await this.$store.dispatch('ISDP/project/getStatisticsLevel', { ...this.formList });
      if(+resultCode === 200 || resultCode.includes('200')) {
        const { S = 0, A = 0, B = 0, C = 0} = data;
        const levelData = [ S, A, B, C ];
        this.remoteData = Object.assign({}, this.remoteData, {
          [this.echartConfig.name]: [ levelData ]
        });
        // this.echartConfig.echartConfig.echart.series[0].data = levelData;
      }
    },
    async getStatisticsDeliver() {
      const { data, resultCode = '' } = await this.$store.dispatch('ISDP/project/getStatisticsDeliver', { ...this.formList });
      if(+resultCode === 200 || resultCode.includes('200')) {
        const yearData = Object.values(data);
        this.remoteData = Object.assign({}, this.remoteData, {
          [this.levelConfig.name]: [ yearData ]
        });
        // this.yearData =
        // this.echartConfig.levelConfig.echart.series[0].data = yearData;
      }
    },
    async getProjectAllList() {
      const { pageCount, pageNum } = this.pagination;
      const { data = {}, resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/project/getProjectAllList', {
        obj: {...this.formList},
        pageCount,
        pageNum
      });
      if(+resultCode === 200 || resultCode.includes('200')) {

        const { content = [], totalElements } = data;
        this.projectList = (content || []).map((item)=> {
          if(item.id === this.projectDefaultID){
            // {name: 'defaultProject', text: '默认项目'}
            item.icons = [  ]
          }
          return item;
        });
        this.pagination.total = totalElements;
      } else  {
        this.$elMessage({
          type: 'error',
          message: resultMessage
        })
      }
    },
    paginationCallback(num) {
      this.pagination.pageNum = num;
      this.getProjectAllList();
    },
    pagiantionSizeChange(num){
      this.pagination.pageNum = 1;
      this.pagination.pageCount = num;
      this.getProjectAllList();
    },
    handleChangeForSelect(args) {
      clearTimeout(timer);
      timer = setTimeout(() => {
        this.getProjectManager(args);
      },300);

    },
    dealData(data = []) {
      let projectManagerNo = data.map((item) => Object.assign({},item,{
        value: item[0],
        label: item[1] + ' ' + item[0]
      }));
      this.remoteData = Object.assign({}, this.remoteData, { projectManagerNo });
    },
    async getProjectManager (projectManagerName) {
      let {data} = await this.$store.dispatch('ISDP/project/getProjectManager', {projectManagerName});
      if(data) {
        const resultData = data.slice(0,10);
        this.dealData(resultData);
      }else {
        this.remoteData = Object.assign({}, this.remoteData, { projectManager: data });
      }
    },
    async saveProjectForDefault(row) {
      const { id } = row;
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/project/saveProjectForDefault', {
        businessId: id
      })

      if(+resultCode === 200 || resultCode.includes('200')) {
        this.getProjectAllList();
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        })
      }
    }
  },
  async created() {
    this.getProjectAllList();
    this.getStatisticsDeliver();
    this.getStatisticsLevel();
    await this.$store.dispatch('ISDP/project/getProjectForDefault');
  }
}
</script>

<style lang="less" scoped>
  .default-project {
    .search-item {
      margin-top: 25px;
    }
    .default-labels {
      padding-left: 15px;
      .label-items {
        margin-right: 0.15625rem /* 30/192 */;
        margin-bottom: 0.15625rem /* 30/192 */;
      }
    }
    .echart {
      display: flex;
      margin-top: 0.15625rem; /* 30/192 */
      .chart-item {
        position: relative;
        flex: 1;
        padding: 0 22px;
        .line {
          position: absolute;
          right: 0;
          top: 50%;
          width: 1px;
          height: 80%;
          margin-top: -17%;
          background-color: #e0e0e0;
        }
      }
    }
  }
</style>
