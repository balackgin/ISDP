<template>
  <div class="management-outsourcer-list">
    <div>

    </div>
    <model-list :options="listConfig"
                :remoteData="{approvalStatus, projectArea: citys}"
                :data="lists"
                @callback="callback"
                :pagination.sync="pagination"></model-list>
  </div>
</template>
<script>
import modelList from '@/components/modelList/';
import listOptions from './config/list.config';
import { mapState } from 'vuex';
export default {
  metaInfo: {
    title: '外包商库'
  },
  components: {
    modelList
  },
  data(){
    return {
      listConfig: listOptions.toJson(),
      lists: [],
      showHighSearch: false,
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20
      },
      params: {
        pageCount: 20,
        pageNum: 1,
        order: 'descending'
      }
    }
  },
  computed: {
    ...mapState({
      approvalStatus: (state) => {
        let obj = state.outsourcer.common.selects.approvalStatus,
          arr = [ ...obj.options ];
        arr.unshift({value: '',label: '请选择'});
        return arr;
      },
      interimVal: (state) => state.common.interimVal,
      citys: (state) => {
        const arr = state.common.citys,
          firstArr = [],
          secondArr = [];
        arr.forEach((item) => {
          if (item.children && item.children.length) {
            secondArr.push(item); // 省
            // item.children.forEach((cityChild) => {
            //   secondArr.push(
            //     Object.assign({}, cityChild, {
            //       label: item.label + ' ' + cityChild.label
            //     })
            //   );
            // });
          } else {
            firstArr.push(item); //直辖市
          }
        });
        return [ {
          label: '请选择',
          value: ''
        }, {
          label: '海外',
          value: '海外'
        },
        {
          label: '全国',
          value: '全国'
        },
        ...firstArr,
        ...secondArr
        ];
      }
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
      } else if(opts.name === 'addSearchItem') {
        const { addSearchItem = [] } = args,
          {listConfig} = this,
          {search} = listConfig,
          {addItem} = search,
          reFormItems = listOptions.search.formItems.toJson(),
          reFormItemsLast = reFormItems.pop(),
          arr = [];
        addSearchItem.forEach((item) => {
          arr.push(addItem[item])
        });
        search.formItems = [ ...reFormItems,...arr,reFormItemsLast ];
        // this.listConfig = listConfig.toJson();  // 若不能触发更新 可执行这一行代码

        // let arr = [], propList = Object.keys(this.listConfig.addItem);
        // if(addSearchItem.length === 0) return false;
        // const lastArr = this.listConfig.formItems.splice(-1, 1);
        // this.listConfig.formItems = this.listConfig.formItems.splice(0, 5);
        // addSearchItem.forEach((item) => {
        //   arr.push(this.listConfig.addItem[item]);
        //   let idx = propList.findIndex((prop) => (item === prop));
        //   propList.splice(idx, 1);
        // });
        // propList.forEach((prop) => {
        //   delete this.listConfig.searchObj[prop];
        // })
        // this.listConfig.formItems = this.listConfig.formItems.concat(arr, lastArr);
      }
    },
    handleChangeForSort(args) {
      const { order } = args;
      if(!order || this.params.order === order){
        return false;
      } else if(this.params.order !== order) {
        this.params.pageNum = 1;
      }
      this.params.order = order;
      this.getLists(this.params);
    },
    handleKeyupForEnter(args){
      this.handleClickForSubmit({name: 'search'},args);
    },
    async getLists(args){
      this.$setSearch(this,{
        moLibrary: args
      });
      let { data,resultCode } = await this.$store.dispatch('management/outsourcer/getOutsourcerLibrary',args)
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
    if(interimVal && interimVal.moLibrary){
      let args = interimVal.moLibrary;
      this.params = args;
      listConfig.searchObj = args.obj;
      this.listConfig = listConfig.toJson();
    }
    this.getLists(this.params);
  }
}
</script>
