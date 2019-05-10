<template>
  <div>
    <div class="documentDialog commonDialog">
      <el-dialog
        title="帮助"
        :visible.sync="documentVisible"
        width="40%"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <div class="documentDialog_content">
          <p class="documentDialog_content_item" @click="operationManual">
            <img src="@ISDP/assets/images/common/common_dialog_icon_fujian.png">
            <span>操作手册</span>
          </p>
          <p class="documentDialog_content_item" @click="processTemplate">
            <img src="@ISDP/assets/images/common/common_dialog_icon_fujian.png">
            <span>流程及标准模板</span>
          </p>
          <p class="documentDialog_content_item" @click="deliverySpecification">
            <img src="@ISDP/assets/images/common/common_dialog_icon_fujian.png">
            <span>交付规范性落地运行管理规定V1.0</span>
          </p>
          <p class="documentDialog_content_item" @click="templateList">
            <img src="@ISDP/assets/images/common/common_dialog_icon_fujian.png">
            <span>交付规范性落地运行管理规定-模版列表</span>
          </p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  props: ['documentVisible'],
  data() {
    return {};
  },
  created() {},
  methods: {
    handleClose() {
      this.$emit('update:documentVisible', false);
    },
    //操作手册下载
    operationManual() {
      window.open(
        'http://10.1.248.135:80/group1/M00/00/0C/CgH4h1zSnBeAX_IVABSFFOPX_yQ28.docx',
        '_self'
      );
    },
    //流程模板下载
    processTemplate() {
      window.open(
        'http://10.1.248.135:80/group1/M00/00/0C/CgH4h1zSnKaATRMxAalt63C_OKg119.zip',
        '_self'
      );
    },
    //交付规范下载
    deliverySpecification() {
      window.open(
        'http://10.1.248.135:80/group1/M00/00/0C/CgH4h1zSnBuAGv_jAADQVQx3APE68.docx',
        '_self'
      );
    },
    //模板列表下载
    templateList() {
      window.open(
        'http://10.1.248.135:80/group1/M00/00/0C/CgH4h1zSnB-ASOFsAACFCoJ0TsA17.xlsx',
        '_self'
      );
    }
  }
};
</script>
<style lang='less' scoped>
.documentDialog /deep/ .el-dialog {
  width: 500px !important;
}
.documentDialog /deep/ .el-dialog__body {
  padding: 20px 0 4px 0px !important;
}
.documentDialog /deep/ .el-dialog__header {
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
.documentDialog {
  &_content {
    padding-left: 80px;
    padding-right: 80px;
    &_item {
      > img {
        margin-right: 5px;
      }
      margin-bottom: 15px;
      border-bottom: 1px dashed #0000cc;
      height: 30px;
      line-height: 30px;
      color: #0000cc;
      cursor: pointer;
    }
  }
}
</style>


    