<template>
  <div class="management-outsourcer-list">
    <model-list :options.sync="listConfig"
                :remoteData="{approvalStatus}"
                :data="lists"
                @callback="callback"
                :pagination.sync="pagination"></model-list>
  </div>
</template>
<script>
import modelList from '@/components/modelList/';
import listConfig from './config/list.config';
import { mapState } from 'vuex';
export default {
  metaInfo: {
    title: '外包商纳入审核'
  },
  components: {
    modelList
  },
  data(){
    return {
      listConfig: listConfig.toJson(),
      lists: [],
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20
      },
      params: {
        pageCount: 20,
        pageNum: 1
      }
    }
  },
  computed: {
    ...mapState({
      approvalStatus: (state) => {
        let obj = state.outsourcer.common.selects.approvalStatus,
          arr = [ ...obj.options ],
          index = arr.findIndex((item) => item.label === '审批通过');
        arr.splice(index,1);
        arr.shift();
        arr.unshift({value: '',label: '请选择'});
        return arr;
      },
      interimVal: (state) => state.common.interimVal
    })
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    paginationCallback(num){
      this.params.pageNum = num;
      this.getLists(this.params);
    },
    handleClickForSubmit(opts = {},args){
      if(opts.name === 'search'){
        this.params = Object.assign({},this.params,{obj: args},{
          pageNum: 1
        });
        this.getLists(this.params);
      }
    },
    handleKeyupForEnter(args){
      this.handleClickForSubmit({name: 'search'},args);
    },
    async getLists(args){
      this.$setSearch(this,{
        moApply: args
      });
      let { data,resultCode } = await this.$store.dispatch('management/outsourcer/getOutsourcerApply',args);
      if(+resultCode === 200 && data){
        this.lists = data.approvalList;
        this.pagination = Object.assign({},this.pagination,{
          total: data.count,
          current: args.pageNum
        });

      }
    }
  },
  async created () {
    if(this.$route.params.type === 'back'){
      await this.$getSearch(this);
    }
    const {interimVal,listConfig} = this;
    if(interimVal && interimVal.moApply){
      let args = interimVal.moApply;
      this.params = args;
      listConfig.searchObj = args.obj;
      this.listConfig = listConfig.toJson();
    }
    this.getLists(this.params);
  }
}
</script>
