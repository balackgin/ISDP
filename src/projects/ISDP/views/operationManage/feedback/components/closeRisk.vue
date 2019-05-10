<template>
  <div>
    <el-collapse-item name="4">
      <template slot="title">
        <span class="arrowIcon">{{closeIconfont}}</span>
        关闭
      </template>
      <div class="riskPresent" v-if="activeName==4">
        <el-form
          :model="riskDetailData"
          :rules="rules"
          ref="riskDetailData"
          label-width="85px"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item class="riskPresent_item detailDescribe" label="关闭结论：" prop="conclusion">
            <span style="display:inline-block;line-height:20px;">{{riskDetailData.conclusion}}</span>
          </el-form-item>
          <el-form-item
            label="相关文件："
            class="riskPresent_item"
            style="width:100%;padding-left:10px;"
          >
            <div class="riskPresent_item_fileList">
              <p
                class="riskPresent_item_fileList_info"
                v-if="item.businessType=='risk_closed'"
                @click="clickFile(item)"
                v-for="item of riskDetailData.attachmentArray"
                :key="item.url"
              >
                <img
                  class="fujianIcon"
                  src="@ISDP/assets/images/common/common_dialog_icon_fujian.png"
                >
                <span class>{{item.fileName}}</span>
              </p>
            </div>
          </el-form-item>
          <el-form-item class="riskPresent_item detailDescribe" label="备注：" prop="closedMemo">
            <span style="display:inline-block;line-height:20px;">{{riskDetailData.closedMemo}}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-item>
  </div>
</template>
<script>
export default {
  props: ['closeIconfont', 'selectRiskIitem', 'activeName', 'riskDetailData'],
  components: {},
  data() {
    return {
      fileList: [],
      rules: {
        conclusion: [
          { required: true, message: '请输入关闭结论', trigger: 'blur' }
        ],
        closedMemo: [
          { required: true, message: '请输入关闭备注', trigger: 'blur' }
        ]
      }
    };
  },
  created() {},
  methods: {
    clickFile(item) {
      this.downloadFile(item);
    },
    validateForm() {
      let flag = false;
      this.$refs['riskDetailData'].validate((valid) => {
        flag = valid;
      });
      return flag;
    }
  }
};
</script>
<style lang="less" scoped>
.riskPresent {
  margin-top: 12px;
  padding-left: 20px;
  &_item&_detail {
    margin-bottom: 10px;
  }
  &_item {
    width: 305px;
    display: inline-block;
    margin-right: 60px;
    margin-bottom: 20px;
    position: relative;
    .fujianIcon {
      display: inline-block;
      background-color: #ff9999;
    }
    &_fileList {
      display: inline-block;
      &_info {
        > span {
          color: #3276ff;
          font-size: 14px;
          margin-left: 5px;
          cursor: pointer;
        }
      }
      &_info:hover .fujianIcon {
        background-color: #ff9999;
      }
    }
    .limitLength {
      position: absolute;
      right: 10px;
      bottom: 0px;
      color: #777a80;
      font-size: 14px;
    }
    .riskUploadBtn {
      position: absolute;
      display: inline-block;
      width: 100px;
      height: 30px;
      border-radius: 15px;
      border: 1px solid #f00000;
      text-align: center;
      line-height: 30px;
      font-size: 14px;
      color: #f00000;
      top: 0;
      left: 0;
    }
    //上传列表样式
    // /deep/ .el-upload-list__item:first-child {
    //   margin-top: 0px;
    // }
    // /deep/ .el-upload-list__item:last-child {
    //   border: none;
    // }
    // /deep/ .el-upload-list__item {
    //   border-bottom: 1px dashed rgba(203, 203, 203, 0.66);
    // }
    // /deep/ .el-upload-list {
    //   display: inline-block;
    //   margin-left: 118px;
    //   width: 470px;
    //   border: solid 1px rgba(203, 203, 203, 0.66);
    // }
    .describeTextarea {
      /deep/ .el-textarea__inner {
        height: 100px;
        resize: none;
      }
    }
    /deep/ .el-input__inner {
      height: 30px;
      line-height: 30px;
    }
    /deep/ .el-form-item__content {
      line-height: 30px;
    }
  }
  &_item.detailDescribe {
    width: 100%;
    /deep/ .el-form-item__content {
      margin-left: 10px !important;
    }
    /deep/ .el-form-item__label {
      float: none;
    }
  }
}
.riskPresent_item /deep/ .el-form-item__label {
  padding: 0;
  color: #777a80;
  font-size: 14px;
  line-height: 30px;
}
</style>






