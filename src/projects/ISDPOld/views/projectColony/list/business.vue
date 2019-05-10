<template>
  <div class="project-list businessopp">
    <model-list :options="listConfig"
                :data="listData"
                :remoteData="remoteData"
                @callback="callback"></model-list>
    <div class="pagination">
      <el-button :disabled="prevButton"
                 @click="paginationClick()"><i class="icon el-icon-arrow-left"></i></el-button>
      <span>{{pagination.pageNum}}</span>
      <el-button :disabled="nextButton"
                 @click="paginationClick('add')"><i class="icon el-icon-arrow-right"></i></el-button>
    </div>
  </div>

</template>
<script>
import modelList from '@/components/modelList';
import listConfig from './config/business.config';
export default {
  components: {
    modelList
  },
  data() {
    return {
      listConfig: JSON.parse(JSON.stringify(listConfig)),
      listData: [],
      remoteData: {},
      nextButton: true,
      prevButton: true,
      params: {},
      pagination: {
        pageNum: 1,
        total: 100,
        pageCount: 20,
        layout: 'prev, pager, next, jumper'
      }
    };
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
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
    async getRole() {
      const { data } = await this.$store.dispatch('ISDP/project/findRole', {
        id: this.$route.query.id
      });
      const projectManagerNo = this.dealMana(data);
      projectManagerNo &&
        projectManagerNo.unshift({ value: '', label: '请选择' });
      this.remoteData = Object.assign({}, this.remoteData, {
        projectManagerNo
      });
    },
    async businessOppList() {
      const { data } = await this.$store.dispatch('ISDP/project/businessOppList', {
        argsMap: this.params,
        pageCount: this.pagination.pageCount,
        pageNum: this.pagination.pageNum
      })
      if (data) {
        this.listData = data;
        this.prevButton = this.pagination.pageNum > 1 ? false : true;
        this.nextButton = data.length < this.pagination.pageCount ? true : false;
      }
    },
    paginationClick(action) {
      if(action === 'add') {
        this.pagination.pageNum++;
      } else {
        this.pagination.pageNum--;
      }
      this.businessOppList();
    },
    handleClickForSubmit(opts, args) {
      if (opts.name === 'search') {
        this.pagination.obj = Object.assign({}, this.pagination.obj, args);
        this.params = args;
        this.businessOppList();
      }
    },
    dealMana(data) {
      const res =
        data && data.map((item) => ({ value: item, label: item.join(' ') }));
      return res || [];
    },
    dataDeal(data) {
      const res =
        data &&
        data.map((item) => ({ value: item.value, label: item.value }));
      return res;
    },
    handleKeyupForEnter(form) {
      this.pagination = Object.assign({}, this.pagination, form);
      this.businessOppList();
    }
  },
  created() {
    this.getLevel();
    this.getRole();
    this.businessOppList();
  }
};
</script>
<style lang="less">
  .project-list.businessopp {
    .pagination {
      margin: 10px 0;
      display: block;
      float: none;
      text-align: right;
      > span {
        line-height: 24px;
        font-size: 16px;
        color: #25aae2;
      }
      > button {
        padding: 0;
        margin: 0 15px;
        border-radius: 50%;
        .icon {
          width: 24px;
          height: 24px;
          font-size: 16px;
          line-height: 24px;
          text-align: center;
        }
      }
    }
  }
</style>
