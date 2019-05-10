<template>
  <div class="distributedDialog commonDialog">
    <el-dialog
      title="派发"
      :visible.sync="distributedVisible"
      width="460px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <el-form
        :model="distributedData"
        :rules="rules"
        ref="distributedData"
        label-width="60px"
        label-position="left"
        class="demo-ruleForm distributedDialog_content"
      >
        <el-form-item class="riskDistributed_item" label="姓名:" prop="dutyPersonName">
          <el-select
            filterable
            v-model="distributedData.dutyPersonNo"
            style="width:226px;"
            @change="memberChange"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) of memberData"
              :key="index"
              :label="item.displayName"
              :value="item.userName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="riskDistributed_item"
          style="margin-bottom:8px;"
          label="工号:"
          prop="dutyPersonNo"
        >
          <el-input placeholder="请输入工号" disabled v-model="distributedData.dutyPersonNo"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <span @click="handleClose" class="commonCancelBtn commonBtn">取 消</span>
        <span @click="saveRiskproblem('distributedData')" class="commonConfirmBtn commonBtn">确 定</span>
      </span>
    </el-dialog>
  </div>
</template> 
<script>
export default {
  props: [
    'distributedVisible',
    'getRiskproblemList',
    'distributedConfirm',
    'memberData'
  ],
  components: {},
  data() {
    return {
      distributedData: {
        dutyPersonName: '',
        dutyPersonNo: '',
        id: '',
        projectId: ''
      },
      rules: {
        dutyPersonName: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        dutyPersonNo: [
          { required: true, message: '请输入工号', trigger: 'blur' }
        ]
      }
    };
  },
  created() {},
  methods: {
    //选择责任人
    memberChange(val) {
      for (let item of this.memberData) {
        if (val == item.userName) {
          this.distributedData.dutyPersonName = item.displayName;
        }
      }
    },
    handleClose() {
      this.$emit('update:distributedVisible', false);
    },
    saveRiskproblem(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.distributedConfirm(this.distributedData);
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.riskDistributed_item {
  width: 286px;
  display: inline-block;
  margin-bottom: 22px;
  position: relative;
  /deep/ .el-input__icon {
    line-height: 30px;
  }
  /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  /deep/ .el-form-item__label {
    line-height: 30px;
    color: #777a80;
    font-size: 14px;
  }
  /deep/ .el-input__inner {
    height: 30px;
    line-height: 30px;
  }
  /deep/ .el-form-item__content {
    line-height: 30px;
  }
}
.distributedDialog /deep/ .el-dialog {
  width: 460px !important;
  height: 302px !important;
}
.distributedDialog /deep/ .el-dialog__body {
  padding: 20px 0 4px 0px !important;
}
.distributedDialog /deep/ .el-dialog__header {
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
.distributedDialog {
  &_content {
    padding-left: 98px;
    border-bottom: 1px solid #e3e3e3;
    position: relative;
    padding-bottom: 50px;
    margin-top: 38px;
    &_item {
      width: 264px;
      margin-bottom: 15px;
      &_label {
        color: #777a80;
        font-size: 14px;
      }
      &_text {
        width: 216px;
        height: 30px;
        /deep/ .el-input__inner {
          height: 30px;
          line-height: 30px;
        }
      }
    }
  }
}
</style>

