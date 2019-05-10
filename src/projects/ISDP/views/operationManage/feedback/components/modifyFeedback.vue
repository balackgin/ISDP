<template>
  <div>
    <div class="addAttachmentDialog commonDialog">
      <el-dialog
        title="详情"
        :visible.sync="modifyFeedbackVisible"
        width="40%"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <div class="addAttachmentDialog_content">
          <el-collapse accordion @change="nodeChange" v-model="activeName">
            <risk-present
              :risk_inputShow="risk_inputShow"
              :downloadFile="downloadFile"
              ref="riskDetailData"
              :presentIconfont="presentIconfont"
              :riskDetailData="riskDetailData"
              v-if="activeName>=1"
              :activeName="activeName"
            ></risk-present>
            <risk-analysis
              ref="riskDetailData"
              :riskDetailData="riskDetailData"
              :analysisIconfont="analysisIconfont"
              v-if="activeName>=2"
              :activeName="activeName"
            ></risk-analysis>
            <risk-progress
              :downloadFile="downloadFile"
              :risk_ongoingShow="risk_ongoingShow"
              ref="riskDetailData"
              :riskDetailData="riskDetailData"
              :progressIconfont="progressIconfont"
              v-if="activeName>=3"
              :activeName="activeName"
            ></risk-progress>
            <close-risk
              :downloadFile="downloadFile"
              :risk_closedShow="risk_closedShow"
              ref="riskDetailData"
              :riskDetailData="riskDetailData"
              v-if="activeName>=4"
              :closeIconfont="closeIconfont"
              :activeName="activeName"
              :selectRiskIitem="selectRiskIitem"
            ></close-risk>
          </el-collapse>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import riskPresent from './riskPresent.vue';
import riskAnalysis from './riskAnalysis.vue';
import riskProgress from './riskProgress.vue';
import closeRisk from './closeRisk.vue';
export default {
  props: [
    'modifyFeedbackVisible',
    'getRiskproblemList',
    'searchConfig',
    'selectRiskIitem'
  ],
  components: {
    riskPresent,
    riskAnalysis,
    riskProgress,
    closeRisk
  },
  data() {
    return {
      isShowBtn: '',
      isShowSaveBtn: true,
      hangRiskVisible: false,
      risk_inputShow: false,
      risk_ongoingShow: false,
      risk_closedShow: false,
      subclassArr: [],
      riskDetailData: {}, //提出的数据
      activeName: this.selectRiskIitem.part.toString(),
      presentIconfont: '+',
      analysisIconfont: '+',
      progressIconfont: '+',
      closeIconfont: '+'
    };
  },
  computed: {
    projectId() {
      const { projectId, id } = this.$route.query;
      return projectId || id;
    }
  },
  created() {
    this.activeName = this.selectRiskIitem.part.toString();
    this.nodeChange(this.activeName);
    this.getRiskDetail();
  },
  methods: {
    //下载文件
    async downloadFile(item) {
      const { data } = await this.$store.dispatch('common/download', {
        url: item.url
      });
      this.$download(data, item.fileName);
    },
    handleClose() {
      this.$emit('update:modifyFeedbackVisible', false);
    },
    //获取详情
    async getRiskDetail() {
      const { data = '', resultCode = '' } = await this.$store.dispatch(
        'ISDP/operationManage/getRiskDetail',
        {
          riskProblemId: this.selectRiskIitem.id
        }
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.riskDetailData = data;
        for (let item of this.searchConfig.classificationArr) {
          if (this.riskDetailData.classification == item.value) {
            this.subclassArr = item.children;
          }
        }
        if (
          this.riskDetailData.progressLogArray &&
          this.riskDetailData.progressLogArray.length > 0
        ) {
          this.riskDetailData.riskProgressDetail = this.riskDetailData.progressLogArray[0].detail;
        }
      }
    },
    nodeChange(activeNames) {
      this.isShowBtn = activeNames;
      this.activeName = this.selectRiskIitem.part.toString();
      if (activeNames == 1) {
        this.presentIconfont = '-';
        this.analysisIconfont = '+';
        this.progressIconfont = '+';
        this.closeIconfont = '+';
      } else if (activeNames == 2) {
        this.presentIconfont = '+';
        this.analysisIconfont = '-';
        this.progressIconfont = '+';
        this.closeIconfont = '+';
      } else if (activeNames == 3) {
        this.presentIconfont = '+';
        this.analysisIconfont = '+';
        this.progressIconfont = '-';
        this.closeIconfont = '+';
      } else if (activeNames == 4) {
        this.presentIconfont = '+';
        this.analysisIconfont = '+';
        this.progressIconfont = '+';
        this.closeIconfont = '-';
      } else if (!activeNames) {
        this.presentIconfont = '+';
        this.analysisIconfont = '+';
        this.progressIconfont = '+';
        this.closeIconfont = '+';
      }
      if (this.activeName * 1 <= this.isShowBtn) {
        this.isShowSaveBtn = true;
      } else {
        this.isShowSaveBtn = false;
      }
      if (this.selectRiskIitem.isClosed == 1) {
        this.isShowSaveBtn = false;
      }
    }
  }
};
</script>
<style>
.arrowIcon {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #7c7c7c;
  line-height: 8px;
  color: #7c7c7c;
  font-weight: bold;
  text-align: center;
  font-size: 14px;
  margin-right: 5px;
}
</style>

<style lang="less" scoped>
.addAttachmentDialog /deep/ .el-dialog {
  width: 854px !important;
}
.addAttachmentDialog /deep/ .el-dialog__body {
  padding: 20px 0 4px 0px !important;
}
.addAttachmentDialog /deep/ .el-dialog__header {
  padding: 0 0 0 14px;
  background-image: linear-gradient(#ffffff, #ffffff),
    linear-gradient(#ffffff, #ffffff);
  background-blend-mode: normal, normal;
  box-shadow: 0px 1px 10px 0px rgba(216, 213, 213, 0.5);
  border-radius: 2px;
  height: 44px;
  line-height: 44px;
  /deep/ .el-dialog__headerbtn {
    top: 12px;
  }
  /deep/ .el-dialog__title {
    font-size: 14px;
    color: #333333;
  }
}
.addAttachmentDialog {
  &_content {
    padding-left: 80px;
    padding-right: 80px;
    padding-bottom: 35px;
    /deep/ .el-collapse-item__header {
      border: none;
      height: 30px;
      line-height: 30px;
      color: #333333;
      font-size: 14px;
    }
    /deep/ .el-icon-arrow-right:before {
      content: '';
    }
    /deep/ .el-collapse-item__content {
      padding-bottom: 0;
    }
    /deep/ .el-collapse-item__wrap {
      border-bottom: none;
    }
    /deep/ .el-collapse {
      border: none;
    }
    &_item {
      margin-top: 15px;
      &_radioBox {
        margin-left: 36px;
      }
      &_label {
        display: inline-block;
        width: 100px;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #777a80;
      }
      &_selectBox {
        width: 250px;
        display: inline-block;
        /deep/ .el-input__icon {
          line-height: 30px;
        }
        /deep/ .el-input__inner {
          height: 30px;
          line-height: 30px;
        }
      }
    }
    .contentIpt {
      padding-left: 10px;
      width: 250px;
      height: 30px;
      background-image: linear-gradient(#ffffff, #ffffff),
        linear-gradient(#ffffff, #ffffff);
      background-blend-mode: normal, normal;
      border-radius: 1px;
      border: solid 1px rgba(203, 203, 203, 0.66);
    }
  }
}
</style>
