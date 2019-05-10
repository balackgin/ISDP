<template>
  <div>
    <el-collapse-item name="1">
      <template slot="title">
        <span class="arrowIcon">{{presentIconfont}}</span>
        问题及风险提出
      </template>
      <div class="riskPresent" v-if="activeName>=1">
        <el-form
          label-width="85px"
          :model="riskDetailData"
          :rules="rules"
          ref="riskDetailData"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item class="riskPresent_item riskPresent_detail" label="标题：" prop="title">
            <span>{{riskDetailData.title}}</span>
          </el-form-item>
          <el-form-item
            prop="proposeDate"
            class="riskPresent_item riskPresent_detail"
            style="margin-right: 0px;"
            label="提出时间："
          >
            <span>{{riskDetailData.proposeDate}}</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail"
            prop="proposePersonName"
            label="提出人："
          >
            <span>{{riskDetailData.proposePersonName}}</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail noRequire"
            style="margin-right: 0px;"
            label="问题来源："
          >
            <span v-if="!riskDetailData.proposeDept">无</span>
            <span
              v-if="riskDetailData.proposeDept"
            >{{searchConfig.proposeDeptObj[riskDetailData.proposeDept]}}</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail detailDescribe"
            label="详情描述："
            prop="description"
          >
            <span style="display:inline-block;line-height:20px;">{{riskDetailData.description}}</span>
          </el-form-item>
          <el-form-item
            label="相关文件："
            class="riskPresent_item riskPresent_detail"
            style="width:100%;padding-left:10px;"
          >
            <div class="riskPresent_item_fileList">
              <p
                class="riskPresent_item_fileList_info"
                v-if="item.businessType=='risk_input'"
                @click="clickFile(item)"
                v-for="item of riskDetailData.attachmentArray"
                :key="item.fileUploadId"
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
            label="业务领域："
            class="riskPresent_item riskPresent_detail disableCheckBox"
            style="width:100%;"
            prop="title"
          >
            <el-checkbox-group v-model="riskDetailData.businessArea">
              <el-checkbox
                disabled
                :key="item.value"
                v-for="item of searchConfig.businessAreaArr"
                v-if="item.value"
                :label="item.value"
                :name="item.value"
              >{{item.label}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label="客户关注："
            class="riskPresent_item riskPresent_detail disableCheckBox"
            style="width:100%;"
            prop="isFocus"
          >
            <el-radio-group v-model="riskDetailData.isFocus">
              <el-radio :label="num1" disabled>是</el-radio>
              <el-radio :label="num" disabled>否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail"
            style="margin-right: 0px;padding-left:10px;"
            label="要求完成："
          >
            <span>{{riskDetailData.requiredDate}}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-item>
  </div>
</template>
<style lang='less'>
.upload-demo {
  display: inline-block;
}
</style>

<script>
import searchConfig from '../config/search.config.json';
export default {
  props: [
    'presentIconfont',
    'activeName',
    'riskDetailData',
    'risk_inputShow',
    'downloadFile'
  ],
  components: {},
  data() {
    return {
      num1: 1,
      num: 0,
      searchConfig,
      fileList: [],
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        proposeDate: [
          { required: true, message: '请选择时间', trigger: 'blur' }
        ],
        proposePersonName: [
          { required: true, message: '请输入提出人', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入详情描述', trigger: 'blur' }
        ],
        businessArea: [
          {
            type: 'array',
            required: true,
            message: '请至少选择一个业务领域',
            trigger: 'change'
          }
        ],
        isFocus: [
          { required: true, message: '请选择客户关注', trigger: 'blur' }
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
  .disableCheckBox {
    /deep/ .el-radio__inner::after {
      background-color: #bbbcbf !important;
    }
    /deep/ .el-radio__inner {
      border-color: #bbbcbf !important;
    }
    /deep/ .el-checkbox__inner {
      border-color: #bbbcbf !important;
    }
    /deep/ .el-checkbox__inner::before {
      background-color: #bbbcbf !important;
    }
  }
  &_item {
    /deep/ .el-input__icon {
      line-height: 30px;
    }
    /deep/ .el-form-item__content {
      line-height: 30px;
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
    width: 305px;
    display: inline-block;
    margin-right: 60px;
    margin-bottom: 20px;
    position: relative;
    .limitLength {
      position: absolute;
      right: 10px;
      bottom: 0px;
      color: #777a80;
      font-size: 14px;
    }
    .describeTextarea {
      /deep/ .el-textarea__inner {
        height: 100px;
        resize: none;
      }
    }
  }
  .fujianIcon {
    display: inline-block;
  }

  .limitLength {
    position: absolute;
    right: 10px;
    bottom: 0px;
    color: #777a80;
    font-size: 14px;
  }
  .describeTextarea {
    /deep/ .el-textarea__inner {
      height: 100px;
      resize: none;
    }
  }
  &_item.detailDescribe {
    width: 100%;
    /deep/ .el-form-item__content {
      margin-left: 10px !important;
      line-height: 30px !important;
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
