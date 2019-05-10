<template>
  <div>
    <div class="addAttachmentDialog commonDialog">
      <el-dialog
        title="新增"
        :visible.sync="addFeedbackVisible"
        width="40%"
        :before-close="handleClose"
        :close-on-click-modal="false"
      >
        <div class="addAttachmentDialog_content">
          <div class="riskPresent">
            <el-form
              :model="addRiskData"
              :rules="rules"
              ref="addRiskData"
              label-width="85px"
              label-position="left"
              class="demo-ruleForm"
            >
              <el-form-item class="riskPresent_item" label="标题：" prop="title">
                <el-input placeholder="请输入标题" v-model="addRiskData.title"></el-input>
              </el-form-item>
              <el-form-item
                class="riskPresent_item"
                style="margin-right: 0px;"
                label="提出时间："
                prop="proposeDate"
              >
                <el-date-picker
                  v-model="addRiskData.proposeDate"
                  style="width:216px;"
                  type="date"
                  :default-value="addRiskData.proposeDate"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
              <el-form-item class="riskPresent_item" label="提出人：" prop="proposePersonName">
                <el-input placeholder="请输入提出人" disabled v-model="addRiskData.proposePersonName"></el-input>
              </el-form-item>
              <el-form-item
                class="riskPresent_item noRequire"
                style="margin-right: 0px;"
                label="问题来源："
              >
                <el-select v-model="addRiskData.proposeDept" style="width:217px;" placeholder="请选择">
                  <el-option
                    v-for="item of searchConfig.proposeDeptArr"
                    v-if="item.value"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                class="riskPresent_item detailDescribe"
                label="详情描述："
                prop="description"
              >
                <el-input
                  type="textarea"
                  style="position:relative;"
                  class="describeTextarea"
                  :maxlength="200"
                  placeholder="请输入问题描述"
                  v-model="addRiskData.description"
                ></el-input>
                <span
                  class="limitLength"
                  v-if="addRiskData.description"
                >{{addRiskData.description.length}}/200</span>
                <span class="limitLength" v-if="!addRiskData.description">0/200</span>
              </el-form-item>
              <el-form-item label="附件上传：" class="riskPresent_item noRequire" style="width:100%;">
                <risk-upload :riskDetailData="addRiskData"></risk-upload>
              </el-form-item>
              <el-form-item
                label="业务领域："
                class="riskPresent_item"
                style="width:100%;"
                prop="businessArea"
              >
                <el-checkbox-group v-model="addRiskData.businessArea">
                  <el-checkbox
                    v-for="item of searchConfig.businessAreaArr"
                    v-if="item.value"
                    :key="item.value"
                    :label="item.value"
                    :name="item.label"
                  >{{item.label}}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item
                label="客户关注："
                class="riskPresent_item"
                style="width:100%;"
                prop="isFocus"
              >
                <el-radio-group v-model="addRiskData.isFocus">
                  <el-radio :label="num1">是</el-radio>
                  <el-radio :label="num">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                class="riskPresent_item"
                style="margin-right: 0px;padding-left:10px;"
                label="要求完成："
              >
                <el-date-picker
                  v-model="addRiskData.requiredDate"
                  style="width:216px;"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <span @click="handleClose" class="commonCancelBtn commonBtn">取 消</span>
          <span class="commonConfirmBtn commonBtn" @click="riskSaveBtn">确 定</span>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import riskPresent from './riskPresent.vue';
import riskUpload from './riskUpload.vue';
import store from '@/store';
export default {
  props: ['addFeedbackVisible', 'getRiskproblemList', 'searchConfig'],
  components: {
    riskPresent,
    riskUpload
  },
  data() {
    return {
      num1: 1,
      num: 0,
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
      },
      addRiskData: {
        projectId: this.$route.query.id || '123456',
        part: 1,
        title: '',
        proposeDate:
          new Date().getFullYear() +
          '-' +
          (new Date().getMonth() + 1 > 10
            ? new Date().getMonth() + 1
            : '0' + (new Date().getMonth() + 1)) +
          '-' +
          (new Date().getDate() > 10
            ? new Date().getDate()
            : '0' + new Date().getDate()),
        proposePerson: store.state.common.userinfo.username,
        proposePersonName: store.state.common.userinfo.nickname,
        proposeDept: '',
        description: '',
        businessArea: [],
        attachmentArray: [],
        isFocus: '',
        requiredDate: ''
      },
      memberData: []
    };
  },
  computed: {
    projectId() {
      const { projectId, id } = this.$route.query;
      return projectId || id;
    }
  },
  created() {},
  methods: {
    riskSaveBtn() {
      this.$refs['addRiskData'].validate((valid) => {
        if (valid) {
          this.riskSave();
        }
      });
    },
    async riskSave() {
      const {
        resultMessage = '',
        resultCode = ''
      } = await this.$store.dispatch(
        'ISDP/operationManage/riskSave',
        this.addRiskData
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.$emit('update:addFeedbackVisible', false);
        this.getRiskproblemList();
      }
    },
    handleClose() {
      this.$emit('update:addFeedbackVisible', false);
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
.riskPresent {
  margin-top: 12px;
  padding-left: 20px;
  &_item&_detail {
    margin-bottom: 10px;
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
