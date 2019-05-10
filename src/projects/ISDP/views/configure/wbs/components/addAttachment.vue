<template>
  <div class="addAttachmentDialog commonDialog">
    <el-dialog
      title="添加"
      :visible.sync="addVisible"
      width="40%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="addAttachmentDialog_content">
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label" style="width:90PX;">交付件名称 :</span>
          <!-- <el-input
            class="contentIpt"
            type="text"
            v-model="addAttachmentdata.name"
            placeholder="请输入交付件名称"
          ></el-input>-->
          <el-input
            v-model="addAttachmentdata.name"
            style="width:234px;"
            size="mini"
            placeholder="请输入交付件名称"
          ></el-input>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">是否必须 :</span>
          <span class="addAttachmentDialog_content_item_radioBox">
            <el-radio v-model="addAttachmentdata.isMustFill" label="1">是</el-radio>
            <el-radio v-model="addAttachmentdata.isMustFill" label="0">否</el-radio>
          </span>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">是否按模板反馈 :</span>
          <span class="addAttachmentDialog_content_item_radioBox">
            <el-radio v-model="addAttachmentdata.feedbackByTemplate" label="1">是</el-radio>
            <el-radio v-model="addAttachmentdata.feedbackByTemplate" label="0">否</el-radio>
          </span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <span @click="handleClose" class="commonCancelBtn commonBtn">取 消</span>
        <span @click="saveDeliverableTemplate" class="commonConfirmBtn commonBtn">确 定</span>
      </span>
    </el-dialog>
  </div>
</template> 
<style lang="less" scoped>
.addAttachmentDialog /deep/ .el-dialog {
  width: 512px !important;
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
    padding-left: 94px;
    border-bottom: 1px solid #e3e3e3;
    padding-bottom: 64px;
    &_item {
      margin-top: 30px;
      &_radioBox {
        margin-left: 20px;
      }
      &_label {
        display: inline-block;
        width: 106px;
        font-family: MicrosoftYaHei;
        font-size: 14px;
        color: #777a80;
      }
    }
    .contentIpt {
      padding-left: 10px;
      width: 234px;
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

<script>
export default {
  props: [
    'addVisible',
    'getDetailJobTemplate',
    'selectedItem',
    'detailJobTemplate'
  ],
  data() {
    return {
      addAttachmentdata: {
        name: '',
        isMustFill: '0',
        feedbackByTemplate: '0',
        wbsItemTemplateCode: this.detailJobTemplate.jobNo
      }
    };
  },
  created() {
    console.log(this.detailJobTemplate.jobNo);
  },
  methods: {
    handleClose() {
      this.$emit('update:addVisible', false);
    },
    async saveDeliverableTemplate() {
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch(
        'ISDP/configure/saveDeliverableTemplate',
        this.addAttachmentdata
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elMessage({
          type: 'success',
          message: resultMessage
        });
        this.getDetailJobTemplate(this.selectedItem);
        this.$emit('update:addVisible', false);
      }
    }
  }
};
</script>

