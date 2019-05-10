<template>
  <div class="riskBackDialog commonDialog">
    <el-dialog
      title="挂起"
      :visible.sync="hangRiskVisible"
      width="540px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="riskBackDialog_content">
        <span class="riskBackDialog_content_label">挂起原因：</span>
        <el-input
          class="riskBackDialog_content_text"
          placeholder="请输入挂起原因"
          :maxlength="200"
          v-model="message"
          type="textarea"
        ></el-input>
        <span class="limitLength">{{message.length}}/200</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <span @click="handleClose" class="commonCancelBtn commonBtn">取 消</span>
        <span @click="saveRiskproblem" class="commonConfirmBtn commonBtn">确 定</span>
      </span>
    </el-dialog>
  </div>
</template> 
<script>
export default {
  props: ['hangRiskVisible', 'hangRiskConfirm'],
  components: {},
  data() {
    return {
      message: ''
    };
  },
  created() {},
  methods: {
    handleClose() {
      this.$emit('update:hangRiskVisible', false);
    },
    saveRiskproblem() {
      if (!this.message) {
        this.$message.error('请输入退回原因！');
      } else {
        this.$emit('update:hangRiskVisible', false);
        this.hangRiskConfirm(this.message, 1);
      }
    }
  }
};
</script>

<style lang="less" scoped>
.riskBackDialog /deep/ .el-dialog {
  width: 540px !important;
  height: 360px !important;
}
.riskBackDialog /deep/ .el-dialog__body {
  padding: 20px 0 4px 0px !important;
}
.riskBackDialog /deep/ .el-dialog__header {
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
.riskBackDialog {
  &_content {
    padding-left: 60px;
    border-bottom: 1px solid #e3e3e3;
    position: relative;
    padding-bottom: 50px;
    margin-top: 30px;
    &_label {
      color: #777a80;
      font-size: 14px;
      float: left;
    }
    &_text {
      width: 328px;
      height: 160px;
      /deep/ .el-textarea__inner {
        width: 328px;
        height: 160px;
        resize: none;
        border: 1px solid rgba(203, 203, 203, 0.66);
      }
    }
    .limitLength {
      position: absolute;
      color: #777a80;
      font-size: 14px;
      right: 88px;
      bottom: 55px;
    }
  }
}
</style>

