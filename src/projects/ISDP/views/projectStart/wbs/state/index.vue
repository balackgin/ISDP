<template>
  <div class="wbsManage-state-wrap flex">
    <div class="summarize-wrap">
      <inside-head :options="{title: '概况浏览'}"></inside-head>
      <div class="overdue-box">
        <model-echart :options="overdueConfig"
                      :remoteData="remoteData"></model-echart>
      </div>
      <model-table :options="summarizeTableConfig"
                   :data="moduleList"
                   @callback="callback"></model-table>
    </div>
    <div class="subTask-wrap flex-item">
      <inside-head :options="{title: '子任务浏览'}"></inside-head>
      <model-table :options="subTaskTableConfig"
                   :data="childTaskList"
                   @callback="callback"></model-table>
    </div>
    <inside-dialog :options="taskConfig"
                   :showModel="true"
                   :show="showDialog"
                   @callback="callback">
      <template slot="content">
        <model-detail :options="formConfig"
                      :data="taskInfo"></model-detail>
      </template>
    </inside-dialog>
  </div>
</template>
<script>

import modelEchart from '@/components/modelEchart';
import overdueConfig from './config/overdue.config';
import summarizeTableConfig from './config/summarize.table.config';
import subTaskTableConfig from './config/subTask.table.config';
import echartColor from '@ISDP/assets/config/echart.config';

import succeeIcon from '@ISDP/assets/images/common/common_table_icon_finish.png';
import progressIcon from '@ISDP/assets/images/common/common_table_icon_ing.png';
import normalIcon from '@ISDP/assets/images/common/common_table_icon_weikaishi.png';

const insideHead = () => import('@ISDP/components/insideHead'),
  insideDialog = () => import('@ISDP/components/insideDialog'),
  modelDetail = () => import('@/components/modelDetail'),
  modelTable = () => import('@/components/modelList/modelTable');

import formConfig from './config/detail.config.json';

overdueConfig.echart.series[0].itemStyle = echartColor.seriesItemStyleColor;

export default {
  components: {
    modelEchart,
    insideHead,
    modelDetail,
    modelTable,
    insideDialog
  },
  data(){
    return {
      overdueConfig,
      summarizeTableConfig,
      subTaskTableConfig,
      moduleList: [],
      formConfig,
      remoteData: {},
      childTaskList: [],
      currentModule: {
        projectModule: ''
      },
      taskConfig: {
        width: '790px',
        title: ''
      },
      taskInfo: {},
      showDialog: false,
      currentTaskId: null
    }
  },
  methods: {
    callback(fnName, ...args){
      this[fnName] && this[fnName](...args);
    },
    beforeClose() {
      this.showDialog = false;
    },
    handleClickForRow(form) {
      let index = Object.keys(form).findIndex((item) => (item === 'progress'));
      if(index >= 0 && this.currentModule.projectModule !== form.projectModule) {
        this.currentModule = form;
        this.getMaintainForAlone();
      }
    },
    handleClickForTypeLink(data){
      // const {$router, $route} = this;
      this.currentTaskId = data.id;
      this.getSubTaskDetail();
      // $router.push({
      //   name: 'ISDPPorjectStartWBSTask',
      //   query: {
      //     id: $route.query.id,
      //     taskId: data.id,
      //     projectId: data.projectId
      //   }
      // });
    },
    // 获取项目模块列表
    async maintainState() {
      const { data, resultCode = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/maintainState', {
        projectId: this.$route.query.id,
        proejctModule: ''
      })
      if(+resultCode === 200 || resultCode.includes('200')) {
        // this.moduleList = data || [];

        if(data) {
          let { progress = '', cumulativeDelay = 0, delayStatus, list = []} = data;
          this.moduleList = (list || []).map((item) => {
            if(+cumulativeDelay >= 80) {
              item.cumulativeDelay = '<span>正常</span>';
            } else if(+cumulativeDelay < 80 && +cumulativeDelay >= 60) {
              item.cumulativeDelay = '<span style="color: red;">延期</span>';
            } else {
              item.cumulativeDelay = '<span style="color: red;">严重延期</span>';
            }
            item.progress = (progress || 0).toFixed() + '%';
            return item;
          });

          this.currentModule = this.moduleList[0] || {};

          const cumulativeDelayData = (progress || 0).toFixed();
          this.remoteData = Object.assign({}, this.remoteData, {
            [this.overdueConfig.name]: [
              [
                { name: cumulativeDelayData + '%',
                  value: cumulativeDelayData,
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
                  name: delayStatus,
                  value: 100 - progress,
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
            ]
          });
          this.getMaintainForAlone();
        }
      }
    },
    // 获取子任务列表
    async getMaintainForAlone() {
      const { projectModule = '' } = this.currentModule || {};
      const { data, resultCode = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/getMaintainForAlone', {
        projectId: this.$route.query.id,
        projectModule
      })
      if(+resultCode === 200 || resultCode.includes('200')) {
        const obj = {
          '0': {
            text: '未开始',
            img: normalIcon
          },
          '1': {
            text: '进行中',
            img: progressIcon
          },
          '99': {
            text: '进行中',
            img: progressIcon
          },
          '100': {
            text: '已完成',
            img: succeeIcon
          }
        };
        this.childTaskList = (data || []).map((item) => {
          const current = obj[item.progressScore] || {};
          const { deviationDay = 0 } = item
          if(+deviationDay > 0) {
            item.deviationDay = `<span style="color: red;">${ deviationDay }</span>`;
          }
          item.icon =  `<img style="margin-right: 4px;" src="${ current.img }" alt=""/> ${ current.text || '' }` ;
          return item;
        });
      }
    },
    async getSubTaskDetail() {
      const { currentTaskId: id } = this;
      const { data, resultCode = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/getSubTaskDetail', {
        id
      })
      if(+resultCode === 200 || resultCode.includes('200')) {
        this.taskInfo = data || {};
        this.taskConfig.title = '子任务：' + data.jobName;
        this.showDialog = true;
      }
    }
  },
  created() {
    this.maintainState();
  }
}
</script>

<style lang="less" scoped>
  .wbsManage-state-wrap {
    .summarize-wrap {
      @wid: 388px;
      // width: 50%;
      // min-width: 50%;
      min-width: 388px;
      max-width: @wid;
      flex-basis: @wid;
      margin-right: 28px;
      flex: auto;
      .overdue-box {
        margin-bottom: 28px;
        box-shadow: 0px 0px 14px 0px rgba(216, 213, 213, 0.2);
        border-radius: 1px;
        background-color: #fff;
      }
    }
    .subTask-wrap {
      min-width: 50%;
      flex-grow: 1;
    }
    .model-detail {
      padding-bottom: 0;
    }
    .con-box {
      padding: 0 75px;
    }
  }
</style>
