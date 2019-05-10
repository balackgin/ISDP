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
              :memberData="memberData"
              :wbsGroupArr="wbsGroupArr"
              :riskDetailData="riskDetailData"
              :analysisIconfont="analysisIconfont"
              :subclassArr.sync="subclassArr"
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
        <span slot="footer" class="dialog-footer">
          <!-- <span
            @click="riskSave"
            class="commonCancelBtn commonBtn"
            v-if="(isShowSaveBtn&&isShowBtn)&&!riskDetailData.isAccepted"
          >保 存</span>-->
          <span
            @click="riskSave"
            class="commonCancelBtn commonBtn"
            v-if="(activeName==1||activeName==3)&&riskDetailData.permission"
          >保 存</span>
          <span
            @click="riskSave"
            class="commonCancelBtn commonBtn"
            v-if="(activeName==2||activeName==4)&&permissionBtns.includes('保存')&&!riskDetailData.isClosed&&!riskDetailData.isAccepted"
          >保 存</span>
          <span
            @click="defeatRisk"
            class="commonCancelBtn commonBtn"
            v-if="(activeName==1&&isShowBtn)&&riskDetailData.permission"
          >作 废</span>
          <span
            class="commonConfirmBtn commonBtn"
            @click="releaseRiskBtn"
            v-if="(activeName==3&&isShowBtn&&isShowSaveBtn)&&riskDetailData.permission"
          >申请关闭</span>
          <span
            class="commonConfirmBtn commonBtn"
            @click="releaseRisk(0)"
            v-if="(activeName==2&&isShowBtn==1)&&!riskDetailData.isAccepted&&riskDetailData.permission"
          >撤 回</span>
          <span
            class="commonConfirmBtn commonBtn"
            @click="releaseRiskBtn"
            v-if="(activeName==1&&isShowSaveBtn)&&riskDetailData.permission"
          >发 布</span>

          <span
            @click="backRiskBtn"
            class="commonCancelBtn commonBtn"
            v-if="(((activeName==2||activeName==4)&&(isShowBtn==2||isShowBtn==4)&&isShowSaveBtn)&&!riskDetailData.isAccepted)&&permissionBtns.includes('退回')"
          >退 回</span>
          <span
            @click="hangRiskBtn"
            class="commonCancelBtn commonBtn"
            v-if="((activeName==2&&isShowSaveBtn)&&!riskDetailData.isAccepted)&&permissionBtns.includes('挂起')"
          >挂 起</span>
          <span
            @click="activateBtn"
            class="commonConfirmBtn commonBtn"
            v-if="((activeName==2&&isShowBtn==2)&&riskDetailData.isAccepted)&&permissionBtns.includes('激活')"
          >激 活</span>
          <span
            @click="distributedBtn"
            class="commonConfirmBtn commonBtn"
            v-if="((activeName==2&&isShowBtn==2)&&!riskDetailData.isAccepted)&&permissionBtns.includes('派发')"
          >派 发</span>
          <span
            @click="closedRiskBtn"
            class="commonConfirmBtn commonBtn"
            v-if="(activeName==4&&riskBackVisible.isClosed!=1&&isShowSaveBtn)&&permissionBtns.includes('关闭')"
          >关 闭</span>
        </span>
      </el-dialog>
    </div>
    <risk-back
      v-if="riskBackVisible"
      :riskBackVisible.sync="riskBackVisible"
      :sendBackRisk="sendBackRisk"
    ></risk-back>
    <hang-risk
      v-if="hangRiskVisible"
      :hangRiskVisible.sync="hangRiskVisible"
      :hangRiskConfirm="hangRiskConfirm"
    ></hang-risk>
    <risk-distributed
      v-if="distributedVisible"
      :distributedVisible.sync="distributedVisible"
      :distributedConfirm="distributedConfirm"
      :memberData="memberData"
    ></risk-distributed>
  </div>
</template>
<script>
import tipImgPath from '@ISDP/assets/images/common/common_dialog_icon_tips.png';
import riskPresent from './riskPresent.vue';
import riskAnalysis from './riskAnalysis.vue';
import riskProgress from './riskProgress.vue';
import closeRisk from './closeRisk.vue';
import riskBack from './riskBack.vue';
import riskDistributed from './riskDistributed.vue';
import hangRisk from './hangRisk.vue';
import { mapState } from 'vuex';
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
    closeRisk,
    riskBack,
    riskDistributed,
    hangRisk
  },
  data() {
    return {
      isShowBtn: '',
      wbsGroupArr: [],
      isShowSaveBtn: true,
      hangRiskVisible: false,
      risk_inputShow: false,
      risk_ongoingShow: false,
      risk_closedShow: false,
      memberData: [],
      subclassArr: [],
      riskDetailData: {}, //提出的数据
      activeName: this.selectRiskIitem.part.toString(),
      riskBackVisible: false, //退回
      distributedVisible: false, //派发
      presentIconfont: '+',
      analysisIconfont: '+',
      progressIconfont: '+',
      closeIconfont: '+',
      distributedData: {
        dutyPersonName: '',
        dutyPersonNo: '',
        id: '',
        projectId: ''
      }
    };
  },
  computed: {
    ...mapState({
      permissionBtns: (state) => {
        const menuData = state.ISDP.common.currentMenu || {};
        return menuData.dialogBtns || [];
      }
    }),
    projectId() {
      const { projectId, id } = this.$route.query;
      return projectId || id;
    }
  },
  created() {
    this.activeName = this.selectRiskIitem.part.toString();
    this.nodeChange(this.activeName);
    this.getRiskDetail();
    this.getMember(); //获取人员
    this.maintainState(); //获取wbs组别
  },
  methods: {
    //获取wbs组别
    async maintainState() {
      const { data, resultCode = '' } = await this.$store.dispatch(
        'ISDP/projectStart/wbs/maintainState',
        {
          projectId: this.$route.query.id
        }
      );
      if (+resultCode === 200 || resultCode.includes('200')) {
        this.wbsGroupArr = data.list;
      }
    },
    //下载文件
    async downloadFile(item) {
      const { data } = await this.$store.dispatch('common/download', {
        url: item.url
      });
      this.$download(data, item.fileName);
    },
    //挂起
    hangRiskBtn() {
      this.hangRiskVisible = true;
    },
    //激活
    activateBtn() {
      this.hangRiskConfirm('', 0);
    },
    //确定挂起
    async hangRiskConfirm(message, type) {
      const params = {
        id: this.selectRiskIitem.id,
        isAccepted: type,
        leftReason: message
      };
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch('ISDP/operationManage/hangRisk', params);
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.$emit('update:modifyFeedbackVisible', false);
        this.getRiskproblemList();
      }
    },
    //调用关闭的保存
    async closedRiskBtn() {
      if (this.$refs['riskDetailData'].validateForm()) {
        if (this.riskDetailData.riskProgressDetail) {
          this.riskDetailData.progressLogArray.push({
            detail: this.riskDetailData.riskProgressDetail
          });
        }
        delete this.riskDetailData.riskProgressDetail;
        const {
          resultMessage = '',
          resultCode = ''
        } = await this.$store.dispatch(
          'ISDP/operationManage/riskSave',
          this.riskDetailData
        );
        if (+resultCode === '200' || resultCode.includes('200')) {
          this.closedRisk();
        }
      }
    },
    //关闭
    async closedRisk() {
      const params = {
        isClosed: 1,
        id: this.selectRiskIitem.id
      };
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch('ISDP/operationManage/closedRisk', params);
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.$emit('update:modifyFeedbackVisible', false);
        this.getRiskproblemList();
      }
    },

    // 作废
    defeatRisk() {
      this.$confirm(
        '<p class="tips"><img class="tipsIcon" src=' +
          tipImgPath +
          '>是否确认作废该条记录？</p><p class="tipInfo">作废后该条记录无法恢复！</p>',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          cancelButtonClass: 'cancelButtonClass',
          confirmButtonClass: 'confirmButtonClass',
          customClass: 'confirmDialog',
          closeOnClickModal: false
        }
      )
        .then(() => {
          this.deleterisk();
        })
        .catch(() => {
          this.$elTooltip({
            type: 'error',
            message: '已取消作废'
          });
        });
    },
    async deleterisk() {
      const params = {
        id: this.selectRiskIitem.id,
        isDel: 1
      };
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch('ISDP/operationManage/defeatRisk', params);
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.$emit('update:modifyFeedbackVisible', false);
        this.getRiskproblemList();
      }
    },
    //保存
    async riskSave() {
      if (this.$refs['riskDetailData'].validateForm()) {
        if (this.riskDetailData.riskProgressDetail) {
          this.riskDetailData.progressLogArray.push({
            detail: this.riskDetailData.riskProgressDetail
          });
        }
        delete this.riskDetailData.riskProgressDetail;
        const {
          resultMessage = '',
          resultCode = ''
        } = await this.$store.dispatch(
          'ISDP/operationManage/riskSave',
          this.riskDetailData
        );
        if (+resultCode === '200' || resultCode.includes('200')) {
          this.$elTooltip({
            type: 'success',
            message: resultMessage
          });
          this.$emit('update:modifyFeedbackVisible', false);
          this.getRiskproblemList();
        }
      }
    },
    //调用发布的保存
    async releaseRiskBtn() {
      if (this.$refs['riskDetailData'].validateForm()) {
        if (this.riskDetailData.riskProgressDetail) {
          this.riskDetailData.progressLogArray.push({
            detail: this.riskDetailData.riskProgressDetail
          });
        }
        delete this.riskDetailData.riskProgressDetail;
        const {
          resultMessage = '',
          resultCode = ''
        } = await this.$store.dispatch(
          'ISDP/operationManage/riskSave',
          this.riskDetailData
        );
        if (+resultCode === '200' || resultCode.includes('200')) {
          this.releaseRisk(1);
        }
      }
    },
    //发布
    async releaseRisk(isEffect) {
      const params = {
        isEffect,
        id: this.selectRiskIitem.id,
        part: this.selectRiskIitem.part
      };
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch(
        'ISDP/operationManage/releaseRisk',
        params
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.$emit('update:modifyFeedbackVisible', false);
        this.getRiskproblemList();
      }
    },
    handleClose() {
      this.$emit('update:modifyFeedbackVisible', false);
    },
    //获取人员
    async getMember() {
      const { data = '', resultCode = '' } = await this.$store.dispatch(
        'ISDP/operationManage/getMember',
        {
          id: this.projectId
        }
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.memberData = data;
      }
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
        if (this.riskDetailData && this.riskDetailData.length > 0) {
          for (tempItem of this.riskDetailData.attachmentArray) {
            if (tempItem.businessType == 'risk_input') {
              this.risk_inputShow = true;
            } else if (tempItem.businessType == 'risk_ongoing') {
              this.risk_ongoingShow = true;
            } else if (tempItem.businessType == 'risk_closed') {
              this.risk_closedShow = true;
            }
          }
        }

        for (let item of this.searchConfig.classificationArr) {
          if (this.riskDetailData.classification == item.value) {
            this.subclassArr = item.children;
          }
        }
      }
    },
    //退回
    backRiskBtn() {
      this.riskBackVisible = true;
    },
    async sendBackRisk(message) {
      const params = {
        isEffect: '0',
        id: this.selectRiskIitem.id,
        inputRejectReason: message
      };
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch(
        'ISDP/operationManage/sendBackRisk',
        params
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.$emit('update:modifyFeedbackVisible', false);
        this.getRiskproblemList();
      }
    },

    //派发
    distributedBtn() {
      if (this.$refs['riskDetailData'].validateForm()) {
        this.distributedData.projectId = this.projectId;
        this.distributedData.id = this.selectRiskIitem.id;
        this.distributedData.dutyPersonName = this.riskDetailData.dutyPersonName;
        this.distributedData.dutyPersonNo = this.riskDetailData.dutyPersonNo;
        this.$confirm(
          '<p class="tips"><img class="tipsIcon" src=' +
            tipImgPath +
            '>是否确认派发？</p><p class="tipInfo">派发后不可撤回！</p>',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            dangerouslyUseHTMLString: true,
            cancelButtonClass: 'cancelButtonClass',
            confirmButtonClass: 'confirmButtonClass',
            customClass: 'confirmDialog',
            closeOnClickModal: false
          }
        )
          .then(() => {
            this.distributedConfirm(this.distributedData);
          })
          .catch(() => {
            this.$elTooltip({
              type: 'error',
              message: '已取消'
            });
          });
      }
    },
    async distributedConfirm(sendParams) {
      if (this.riskDetailData.riskProgressDetail) {
        this.riskDetailData.progressLogArray.push({
          detail: this.riskDetailData.riskProgressDetail
        });
      }
      delete this.riskDetailData.riskProgressDetail;
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch(
        'ISDP/operationManage/riskSave',
        this.riskDetailData
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        const params = {
          isEffect: 1,
          id: this.selectRiskIitem.id,
          part: this.selectRiskIitem.part
        };
        const {
          resultMessage = '',
          resultCode = ''
        } = await this.$store.dispatch(
          'ISDP/operationManage/releaseRisk',
          params
        );
        if (+resultCode === '200' || resultCode.includes('200')) {
          this.sendTask(sendParams);
        }
      }
    },
    async sendTask(params) {
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch('ISDP/operationManage/sendTask', params);
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.$emit('update:modifyFeedbackVisible', false);
        this.getRiskproblemList();
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
    border-bottom: 1px solid #e3e3e3;
    padding-bottom: 25px;
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
