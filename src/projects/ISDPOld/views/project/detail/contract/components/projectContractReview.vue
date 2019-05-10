<template>
  <div class="project-list businessopp">
    <div class="txt"><span>基本信息</span><span class="line"></span></div>
    <model-detail :options="listConfig.detail"
                  :data="listData"
                  @callback="callback"></model-detail>
    <div class="txt"><span>签单客户/渠道信用相关(合同付款方式及账期天数已统一至合同付款条款页签中进行维护)</span><span class="line"></span></div>
    <model-detail :options="listConfig.customer"
                  :data="listData"
                  @callback="callback"></model-detail>
    <div class="txt"><span>其他费用（单位：元）</span><span class="line"></span></div>
    <model-detail :options="listConfig.otherCost"
                  :data="listData"
                  @callback="callback"></model-detail>
    <div class="txt"><span>创建信息</span><span class="line"></span></div>
    <model-detail :options="listConfig.createInfo"
                  :data="listData"
                  @callback="callback"></model-detail>
  </div>

</template>
<script>
import { mapState } from 'vuex';
import modelDetail from '@/components/modelDetail'
import listConfig from './config/contractReview.config';
export default {
  components: {
    modelDetail
  },
  data() {
    return {
      listConfig: JSON.parse(JSON.stringify(listConfig)),
      listData: {},
      remoteData: {},
      nextButton: true,
      prevButton: true
    };
  },
  computed: {
    ...mapState({
      contractId: (state) => state.ISDPOld.project.detailData && state.ISDPOld.project.detailData.data && state.ISDPOld.project.detailData.data.contractId || ''
    })
  },
  watch: {
    opportunityId(newVal, oldVal) {
      if(newVal !== oldVal) {
        this.contractGeneral();
      }
    }
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    async contractGeneral() {
      const { data, resultCode } = await this.$store.dispatch('ISDP/project/contractGeneral', {
        rowId: this.contractId
      })
      if (data && resultCode && (+resultCode === 200 || resultCode.includes('200'))) {
        let { agreeNum, detailUrl } = data;
        this.listData = data;
        this.listData.agreeNum = {
          link: detailUrl,
          fileName: agreeNum
        }
      }
    }
  },
  created() {
    if(this.contractId) {
      this.contractGeneral();
    }
  }
};
</script>
<style lang="less">
  .project-list.businessopp {
    > .txt {
      position: relative;
      z-index: 1;
      line-height: 42px;
      margin-top: 30px;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      display: flex;
      span {
        &:first-child {
          position: relative;
          z-index: 3;
          padding: 0 15px;
          background: #fff;
        }
        &:last-child {
          position: absolute;
          top: 50%;
          width: 100%;
          display: block;
          height: 1px;
          z-index: 2;
          background: #ddd;
        }
      }
    }
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
