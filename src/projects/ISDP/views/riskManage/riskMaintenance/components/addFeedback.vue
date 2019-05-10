<template>
  <div class="addAttachmentDialog">
    <el-dialog
      title="添加"
      :visible.sync="addFeedbackVisible"
      width="40%"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="addAttachmentDialog_content">
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">
            <label style="color:red;">*</label>标题：
          </span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="addFeedbackParams.title" placeholder="请输入标题"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">提出人：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="addFeedbackParams.proposePerson" placeholder="请输入提出人"></el-input>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">问题来源：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-select v-model="addFeedbackParams.proposeDept" size="mini" style="width:100%;">
              <el-option
                v-for="item in searchConfig.proposeDeptArr"
                v-if="item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">提出日期：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-date-picker
              style="width:100%"
              :picker-options="pickerOptions0"
              v-model="addFeedbackParams.proposeDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">业务领域：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-select
              v-model="addFeedbackParams.businessArea"
              multiple
              size="mini"
              style="width:100%;"
            >
              <el-option
                v-for="item in searchConfig.businessAreaArr"
                v-if="item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">重要性：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-select v-model="addFeedbackParams.importanceLevel" size="mini" style="width:100%;">
              <el-option
                v-for="item in searchConfig.importanceLevelArr"
                v-if="item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">紧急性：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-select v-model="addFeedbackParams.urgentLevel" size="mini" style="width:100%;">
              <el-option
                v-for="item in searchConfig.urgentLevelArr"
                v-if="item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">计划完成：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-date-picker
              style="width:100%"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions1"
              v-model="addFeedbackParams.planEndDate"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </div>
        </div>
        <div class="addAttachmentDialog_content_item">
          <span class="addAttachmentDialog_content_item_label">责任人：</span>
          <div class="addAttachmentDialog_content_item_selectBox">
            <el-input v-model="addFeedbackParams.dutyPersonName" placeholder="请输入责任人"></el-input>
          </div>
        </div>
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
  props: ['addFeedbackVisible', 'getRiskproblemList', 'searchConfig'],
  data() {
    return {
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.addFeedbackParams.planEndDate) {
            return (
              time.getTime() >=
              new Date(
                this.addFeedbackParams.planEndDate.toString()
              ).getTime() *
                1 -
                86400000
            );
          } else {
            return false;
          }
        }
      },
      pickerOptions1: {
        disabledDate: (time) => {
          if (this.addFeedbackParams.proposeDate) {
            return (
              time.getTime() <=
              new Date(this.addFeedbackParams.proposeDate.toString()).getTime()
            );
          }
        }
      },
      addFeedbackParams: {
        type: 'OTHER',
        projectId: this.$route.query.id || '123456',
        title: '', //标题
        proposePerson: '', //提出人
        proposeDept: '', //问题来源
        proposeDate: '', //提出日期
        businessArea: [], //业务领域
        importanceLevel: '', //重要性
        urgentLevel: '', //紧急性
        planEndDate: '', //计划完成
        dutyPersonName: '' //责任人
      }
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
    handleClose() {
      this.$emit('update:addFeedbackVisible', false);
    },
    async saveRiskproblem() {
      if (this.addFeedbackParams.title) {
        const {
          resultMessage = '',
          resultCode = ''
        } = await this.$store.dispatch(
          'ISDP/operationManage/saveRiskproblem',
          this.addFeedbackParams
        );
        if (+resultCode === '200' || resultCode.includes('200')) {
          this.$elTooltip({
            type: 'success',
            message: resultMessage
          });
          this.getRiskproblemList();
          this.$emit('update:addFeedbackVisible', false);
        }
      } else {
        this.$message.error('请输入标题！');
      }
    }
  }
};
</script>
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
    padding-left: 74px;
    border-bottom: 1px solid #e3e3e3;
    padding-bottom: 35px;
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
