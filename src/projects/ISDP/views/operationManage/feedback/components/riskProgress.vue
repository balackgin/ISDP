<template>
  <div>
    <el-collapse-item name="3">
      <template slot="title">
        <span class="arrowIcon">{{progressIconfont}}</span>
        进展
      </template>
      <div class="riskPresent" v-if="activeName>=3">
        <el-form
          :model="riskDetailData"
          :rules="rules"
          ref="riskDetailData"
          label-width="85px"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item
            class="riskPresent_item riskPresent_detail detailDescribe"
            label="进展详情："
            prop="desc"
          >
            <div
              class="riskPresent_item_detail"
              style="border:1px solid rgba(203, 203, 203, 0.66);"
            >
              <div
                class="riskPresent_item_detail_list"
                v-for="(item, index) of riskDetailData.progressLogArray"
                v-if="item.isEffect==1"
                :key="index +''"
              >
                <span class="riskPresent_item_detail_list_info">{{item.detail}}</span>
                <span class="riskPresent_item_detail_list_time">{{item.modifyDate}}</span>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            label="相关文件："
            class="riskPresent_item riskPresent_detail"
            style="width:100%;padding-left:10px;"
          >
            <div class="riskPresent_item_fileList">
              <p
                class="riskPresent_item_fileList_info"
                v-if="item.businessType=='risk_ongoing'"
                v-for="item of riskDetailData.attachmentArray"
                @click="clickFile(item)"
              >
                <img
                  class="fujianIcon"
                  src="@ISDP/assets/images/common/common_dialog_icon_fujian.png"
                >
                <span class>{{item.fileName}}</span>
              </p>
            </div>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail detailDescribe"
            label="备注："
            prop="desc"
          >
            <span
              style="display:inline-block;line-height:20px;"
              v-if="!riskDetailData.progressMemo"
            >无</span>
            <span
              style="display:inline-block;line-height:20px;"
              v-if="riskDetailData.progressMemo"
            >{{riskDetailData.progressMemo}}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-item>
  </div>
</template>
<script>
export default {
  props: [
    'progressIconfont',
    'activeName',
    'riskDetailData',
    'riskProgressDetail',
    'downloadFile'
  ],
  components: {},
  data() {
    return {
      fileList: [],
      rules: {
        riskProgressDetail: [
          { required: true, message: '请输入进展详情', trigger: 'blur' }
        ],
        progressMemo: [
          { required: true, message: '请输入进展详情', trigger: 'blur' }
        ]
      }
    };
  },
  created() {},
  methods: {
    validateForm() {
      let flag = false;
      this.$refs['riskDetailData'].validate((valid) => {
        flag = valid;
      });
      return flag;
    },
    clickFile(item) {
      this.downloadFile(item);
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
    }
    &_info:hover .fujianIcon {
      background-color: #ff9999;
    }
    &_detail {
      width: 664px;
      border: 1px solid rgba(203, 203, 203, 0.66);
      padding-left: 10px;
      padding-right: 10px;
      border-bottom: none;
      &_list:last-child {
        border: none;
      }
      &_list {
        padding-top: 8px;
        border-bottom: 1px dashed rgba(203, 203, 203, 0.66);
        position: relative;
        &_info {
          color: #333333;
          font-size: 14px;
          width: 550px;
          line-height: 20px;
          display: inline-block;
        }
        &_time {
          position: absolute;
          bottom: 0px;
          right: 0px;
          color: rgba(51, 51, 51, 0.6);
          font-size: 14px;
        }
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
