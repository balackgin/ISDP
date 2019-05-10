<template>
  <div class="isdp-project-list-wrap"
       :getUser="getUser">
    <model-list :options="listConfig"
                :pagination="pagination"
                :data="listData"
                :remoteData="remoteData"
                :searchForm="listForm"
                @callback="callback"></model-list>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import routeConfig from '@/route/config/oldISDP.config';
import modelList from '@/components/modelList';
import listConfig from './config/list.config';
const listParams = Object.assign(
  {},
  {
    pageCount: 20,
    pageNum: 1,
    obj: {
      contractNo: '',
      contractName: '',
      projectLevel: '',
      // mana: '',
      projectStatus: '',
      projectManagerNo: ''
    }
  }
);

let time = '';
export default {
  components: {
    modelList
  },
  data() {
    return {
      listConfig: listConfig.toJson(),
      listParams: listParams.toJson(),
      listData: [],
      remoteData: {},
      pagination: {
        current: 1,
        total: 0,
        pageSize: 20
      },
      listForm: {
        contractNo: '',
        contractName: '',
        projectLevel: '',
        projectStatus: '',
        projectModel: '',
        projectManagerNo: ''
      }
    };
  },
  computed: {
    ...mapState({
      projectManager: (state) => state.ISDPOld.project.projectManager,
      getUser(state){
        let userinfo = state.common.userinfo || {},
          usertype = userinfo.usertype || [],
          result = listConfig.toJson();

        if(!usertype.includes('pmo')){
          result.search.formItems.pop();
        }
        this.listConfig = result.toJson();
      },
      interimVal: (state) => state.common.interimVal
    })
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    async getList() {
      const params = this.listParams;

      this.$store.dispatch('common/session',{  //存搜索条件
        key: 'searchCriteria',
        val: {
          plList: params
        },
        action: {
          isCopy: true,
          isSession: true
        }
      });

      let { data } = await this.$store.dispatch(
        'ISDPOld/project/getProjectList',
        params
      );
      if (data && data.content) {
        // this.pagination.total = +data.totalElements;
        this.pagination = Object.assign({},{
          current: params.pageNum,
          total: +data.totalElements,
          pageSize: 20
        });
        this.listData = data.content;
      }
    },
    async getLevel() {
      const { data } = await this.$store.dispatch(
        'ISDPOld/project/getProjectSelect',
        {
          type: 'projectLevel'
        }
      );
      const projectLevel = this.dataDeal(data);
      projectLevel && projectLevel.unshift({ value: '', label: '请选择' });
      this.remoteData = Object.assign({}, this.remoteData, { projectLevel });
    },
    async getRole(val) {
      const { data = [] } = val && await this.$store.dispatch('ISDP/project/findRole', {
        projectManagerName: val
      });
      let result = data && data.map((item)=>({
        label: item[1] + ' (' + item[0] + ')',
        value: item[0]
      }));
      this.remoteData =  Object.assign({},this.remoteData,{
        projectManagerNo: val ? result : []
      });
    },
    paginationCallback(num) {
      this.listParams.pageNum = num;
      this.getList();
    },
    handleClickForSubmit(opts, args) {
      if (opts.name === 'search') {
        this.listParams = Object.assign({}, this.listParams ,{obj: args},{pageNum: 1});
        this.getList();
      }
    },
    dealMana(data) {
      const res =
        data && data.map((item) => ({ value: item, label: item }));
      return res || [];
    },
    dataDeal(data) {
      const res =
        data &&
        data.map((item) => ({ value: item.value, label: item.value }));
      return res;
    },
    handleKeyupForEnter(form) {
      this.handleClickForSubmit({name: 'search'},form);
    },
    async handleChangeForSelect(val){
      clearTimeout(time);
      time = setTimeout(() => {
        this.getRole(val);
      },300);
    }
  },
  async created() {
    const detailRoute = this.$route.name ===  routeConfig.colonyList  ? routeConfig.colonySurvey : routeConfig.projectDetail;
    this.remoteData = Object.assign({},this.remoteData,{contractNameRoute: (opts,data) => ({
      name: detailRoute,
      query: {
        id: data.id
      }
    })});

    this.getLevel();
    const {$route} = this;
    if($route.params.type === 'back'){
      await this.$store.dispatch('common/session',{  //取搜索条件
        key: 'searchCriteria',
        // plList,
        action: {
          isSession: true
        }
      });
      const {interimVal} = this;
      if(interimVal && interimVal.plList){
        let params = interimVal.plList;
        this.listParams = params;
        this.listForm = params.obj;
      }
    }
    this.getList();
  }
};
</script>

<style lang="less">
  .isdp-project-list-wrap {
    .model-list {
      .el-form {
        .wid100 {
          .el-form-item__content {
            width: 100px;
          }
        }
      }
    }
  }
</style>
