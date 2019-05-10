<template>
  <div class="risk">
    <model-list :options="riskConfig"
                :data="listData"
                :remoteData="remoteData"
                :pagination="pagination"
                :fns="tableActions"
                class="project-risk-list-wrap"
                @callback="callback"></model-list>
    <whole-dialog :show="dialogShow"
                  :currentData="currentRow"
                  @callback="callback"></whole-dialog>
  </div>
</template>
<script>
import {mapState} from 'vuex';
import modelList from '@/components/modelList';
import wholeDialog from './wholeDialog';
import Config from './config/whole.risk.config';
export default {
  components: {
    modelList,
    wholeDialog
  },
  data(){
    return {
      // riskConfig: JSON.parse(JSON.stringify(Config.listConfig)),
      searchParams: {
        sortColumn: 'importanceLevel',
        sortType: 'desc',
        obj: {}
      },
      pagination: {
        pageNum: 1,
        total: 0,
        pageCount: 15
      },
      remoteData: {},
      listData: [],
      // end of search
      currentRow: {},
      dialogShow: false,
      tableActions: {
        deviation(value){
          return +value > 0 ? `延后${ value }天` :  +value < 0 &&  `提前${ Math.abs(+value) }天` || value;
        }
      }
    }
  },
  computed: {
    ...mapState({
      projectManager: (state) => state.ISDPOld.project.projectManager
    }),
    riskConfig(){
      let obj = Config.listConfig.toJson();
      if(!this.projectManager){
        obj.search.btns.pop();
        obj.table.columns.pop();
      }
      return obj;
    }
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    async getList(){
      const {searchParams,pagination,$route} = this;
      searchParams.obj.projectId = $route.query.id;
      let params = Object.assign({},searchParams,pagination);
      let {data} = await this.$store.dispatch('ISDPOld/project/getRiskList',params);
      if(data){
        this.pagination.total = data.totalElements;
        this.listData = (data.content || []).map((item) => {
          const {deviation} = item;
          item.deviation = +deviation > 0 ? `延后${ deviation }天` :  +deviation < 0 &&  `提前${ Math.abs(+deviation) }天` || deviation;
          return item;
        }) ;
      }
    },
    handleClickForSubmit(opts,args){
      if(opts.name === 'search'){
        let params = args;
        if(params.date){
          params.planStartDate = params.date[0];
          params.planEndDate = params.date[1];
        }
        this.searchParams = Object.assign({},this.searchParams,{obj: args});
        this.getList();
      }else if (opts.name === 'add'){
        this.dialogShow  = true;
      }
    },
    paginationCallback(num){
      this.pagination = Object.assign({},this.pagination,{pageNum: num});
      this.getList();
    },
    // end of search
    // end of search
    // end of search
    edit(data,row){
      this.currentRow = Object.assign({},row);
      this.dialogShow = true;
    },
    remove(data, rowData) {
      this.$confirm('确定要删除该风险问题信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let {resultCode} = await this.$store.dispatch('ISDP/project/removeRiskItem',{
            id: rowData.id,
            isDel: 1
          });
          if(+resultCode === 200 || resultCode.includes('200')){
            this.getList();
            this.$elMessage({
              message: '操作成功!',
              type: 'success'
            });
          }
        });
    },
    handleDBLClickForRow(row){
      if(this.projectManager){
        this.edit(null,row);
      }
    },
    // end of table
    // end of table
    // end of table
    beforeClose(){
      this.currentRow = Object.assign({});
      this.dialogShow = false;
    },
    updateList(){
      this.beforeClose();
      this.getList();
    }
  },
  created () {
    this.getList();
  }
}
</script>
<style lang="less" scoped>
  .risk {
    button {
      padding: 8px 10px;
      margin-left: 30px;
    }
  }
</style>
<style lang="less">
  .risk {
    .model-form-item-wrap {
      .el-form-item__label {
        line-height: 24px;
      }
    }
    .project-risk-list-wrap {
      .form-item-wid {
        .el-input__inner {
          width: 120px;
        }
      }
    }
  }
</style>
