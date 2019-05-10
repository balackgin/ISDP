<template>
  <div class="operationManage-budget-wrap">
    <inside-tabs :options="tabsConfig"
                 :remoteData="insideHeadRemote"
                 :keyValue="{routeName: 'urlPath',text: 'elementName'}"></inside-tabs>
    <insideHead class="inside-head"
                :options="headConfig"
                :form="headForm"
                @callback="callback">
      <span class="tooltip-text"
            slot="tooltip"
            v-if="headConfig.btns.length">
        <i class="el-icon-warning"></i>
        项目预算要点击【发布】后才会正式生效，上传错误请重新上传
      </span>
    </insideHead>
    <model-table class="budget-table"
                 :options="tableConfig"
                 :data="tableData"
                 :key="tableKey+''"
                 :remoteData="remoteData"></model-table>
  </div>
</template>
<script>
import modelTable from '@/components/modelList/modelTable';
import insideHead from '@ISDP/components/insideHead';
import insideTabs from '@ISDP/components/insideTabs';
import tabsConfig from './config/tabs.config';
import headOpts from './config/head.config';
import tableConfig from './config/table.config';
import { mapState } from 'vuex';
const tableConfigCopy = tableConfig.toJson();
export default {
  components: {
    modelTable,
    insideHead,
    insideTabs
  },
  data(){
    return {
      // headConfig,
      tableConfig,
      tableData: [],
      // tabsConfig,
      tableKey: 1,
      headForm: {
        projectId: ''
      },
      remoteData: {
        cellClassName(row,column){
          if(column.property === 'subject'){
            return 'level_' + row.parentId
          }
        }
      }

    }
  },
  computed: {
    ...mapState({
      userinfo: (state) => state.common.userinfo || {},
      headConfig: (state) => {
        const menuData = state.ISDP.common.currentMenu || {},
          {btns = []} = menuData,
          resultData = headOpts.toJson();

        resultData.btns = resultData.btns.filter((item) => btns.includes(item.text));
        return resultData;
      },
      insideHeadRemote(){
        const {query,name} = this.$route;
        return {
          showBackBtn: name === 'ISDPOperationFeedback',
          backRouteName: {
            name: 'ISDPOperationBudget',
            query: {
              id: query.id
            }
          }
        }
      },
      tabsConfig(state){
        const  config = tabsConfig.toJson(),
          currentMenu = state.ISDP.common.currentMenu || {},
          menuArr = currentMenu.insideMenuData || [],
          pMenuObj =  menuArr[menuArr.length - 2] || {};
        config.navs = {
          data: (pMenuObj.children || []).filter((item) => item.select)
        };

        return config;
      }
    })
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    async getList(){
      const {userinfo,headForm} = this;
      const {data = {}} =  await this.$store.dispatch('ISDP/operationManage/budget/getBudgetList',headForm),
        {effectVersion,latestVersion,userId} = data,
        matchObj = (num) => ({
          label: `预算v${ num }.0`,
          children: [
            {
              label: `预算v${ num }.0`,
              prop: `budget_${ num }`,
              columnOpts: {
                minWidth: 130
              }
            },
            {
              label: `差异(${ num <= 1 ? '概算-预算' : `v${ num - 1 }.0-v${ num }.0` })`,
              prop: `diffValue_${ num }`,
              columnOpts: {
                minWidth: 150
              }
            },
            {
              label: '差异分析',
              prop: `diffReason_${ num }`,
              columnOpts: {
                minWidth: 130
              }
            }
          ]
        }),
        resultArr = [],
        tableOpts = tableConfigCopy.toJson();

      let eachNum = userinfo.username === userId ? latestVersion : effectVersion,
        startNum = 2;
      while(startNum <= eachNum){
        resultArr.push(matchObj(startNum));
        startNum++;
        if(startNum >= 100){
          return false;
        }
      }
      resultArr.push({
        label: 'GAP',
        children: [ {
          label: '预算v1.0-汇总',
          prop: 'gapValue',
          columnOpts: {
            minWidth: 150
          }
        } ]
      });
      tableOpts.columns.push(...resultArr);
      this.tableConfig = tableOpts.toJson();
      this.tableKey++;
      this.tableData = data.budgetDTOArrayList || [];
    },
    // inside-head btns start
    async headDownload(){
      // 导出模板
      // window.open('/easywork/api/project/budget/export?projectId=123456');
      const {data} = await this.$store.dispatch('ISDP/operationManage/budget/exportBudget',this.headForm);
      this.$download(data,'项目预算模板.xlsx');
    },
    async headSubmit(){
      const {resultCode,resultMessage} = await this.$store.dispatch('ISDP/operationManage/budget/publishBudget',this.headForm);
      if(+resultCode === 200){
        this.$elTooltip({
          message: resultMessage
        });
        this.getList();
      }
    },
    onSuccessForUpload(res = {}){
      const {resultMessage = ''} = res;
      resultMessage && this.$elTooltip({
        message: resultMessage
      });
      this.getList();
    }
  },
  created(){
    this.headForm = {
      projectId: this.$route.query.id
    };
    this.getList();
  }
}
</script>
<style lang="less">
  .operationManage-budget-wrap {
    height: 100%;
    .inside-head {
      margin-top: 24px;
    }
    .tooltip-text {
      margin-right: 36px;
      font-size: 14px;
      color: #86898e;
      i {
        color: #ffa200;
        font-size: 16px;
      }
    }
    // .budget-table {
    //   height: -ms-calc(100% - 90px);
    //   height: -webkit-calc(100% - 90px);
    //   height: -moz-calc(100% - 90px);
    //   height: calc(100% - 90px);
    //   .el-table {
    //     height: 100%;
    //     .el-table__body-wrapper {
    //       height: -ms-calc(100% - 106px);
    //       height: -webkit-calc(100% - 106px);
    //       height: -moz-calc(100% - 106px);
    //       height: calc(100% - 106px);
    //     }
    //   }
    // }
  }
</style>
