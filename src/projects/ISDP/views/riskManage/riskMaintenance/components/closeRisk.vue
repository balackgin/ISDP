<template>
  <div>
    <el-collapse-item name="4">
      <template slot="title">
        <span class="arrowIcon">{{closeIconfont}}</span>
        关闭
      </template>
      <div
        class="riskPresent"
        v-if="activeName==4&&(selectRiskIitem.isClosed==0||selectRiskIitem.isClosed==null)"
      >
        <el-form
          :model="riskDetailData"
          :rules="rules"
          ref="riskDetailData"
          label-width="85px"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item class="riskPresent_item detailDescribe" label="关闭结论：" prop="conclusion">
            <el-input
              type="textarea"
              style="position:relative;"
              class="describeTextarea"
              placeholder="请输入问题描述"
              v-model="riskDetailData.conclusion"
            ></el-input>
            <span class="limitLength" v-if="!riskDetailData.conclusion">0/200</span>
            <span
              class="limitLength"
              v-if="riskDetailData.conclusion"
            >{{riskDetailData.conclusion.length}}/200</span>
          </el-form-item>
          <el-form-item label="附件上传：" class="riskPresent_item noRequire" style="width:100%;">
            <risk-upload :riskDetailData="riskDetailData"></risk-upload>
          </el-form-item>
          <el-form-item class="riskPresent_item detailDescribe noRequire" label="备注：">
            <el-input
              type="textarea"
              style="position:relative;"
              class="describeTextarea"
              placeholder="请输入备注"
              v-model="riskDetailData.closedMemo"
            ></el-input>
            <span class="limitLength" v-if="!riskDetailData.closedMemo">0/200</span>
            <span
              class="limitLength"
              v-if="riskDetailData.closedMemo"
            >{{riskDetailData.closedMemo.length}}/200</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="riskPresent" v-if="selectRiskIitem.isClosed==1">
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
          <el-form-item class="riskPresent_item detailDescribe noRequire" label="备注：">
            <span style="display:inline-block;line-height:20px;">{{riskDetailData.closedMemo}}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-item>
  </div>
</template>
<script>
import riskUpload from './riskUpload.vue';
export default {
  props: ['closeIconfont', 'selectRiskIitem', 'activeName', 'riskDetailData'],
  components: {
    riskUpload
  },
  data() {
    return {
      fileList: [],
      rules: {
        conclusion: [
          { required: true, message: '请输入关闭结论', trigger: 'blur' }
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






