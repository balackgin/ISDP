<template>
  <div>
    <el-collapse-item name="2">
      <template slot="title">
        <span class="arrowIcon">{{analysisIconfont}}</span>
        问题及风险分析
      </template>
      <div class="riskPresent" v-if="activeName==2&&!riskDetailData.isAccepted">
        <el-form
          :model="riskDetailData"
          :rules="rules"
          ref="riskDetailData"
          label-width="88px"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item class="riskPresent_item" label="问题/风险：" prop="problemOrRisk">
            <el-select v-model="riskDetailData.problemOrRisk" placeholder="请选择">
              <el-option label="问题" value="PROBLEM"></el-option>
              <el-option label="风险" value="RISK"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="riskPresent_item" label="重要性：" prop="importanceLevel">
            <el-select v-model="riskDetailData.importanceLevel" placeholder="请选择">
              <el-option
                v-for="item of searchConfig.urgentLevelArr"
                v-if="item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="riskPresent_item"
            style="margin-right:0;"
            label="紧急性："
            prop="urgentLevel"
          >
            <el-select v-model="riskDetailData.urgentLevel" placeholder="请选择">
              <el-option
                v-for="item of searchConfig.urgentLevelArr"
                v-if="item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="riskPresent_item detailDescribe" label="详细描述：" prop="newDesc">
            <el-input
              type="textarea"
              style="position:relative;"
              class="describeTextarea"
              placeholder="请输入问题描述"
              v-model="riskDetailData.newDesc"
            ></el-input>
            <span
              class="limitLength"
              v-if="riskDetailData.newDesc"
            >{{riskDetailData.newDesc.length}}/200</span>
            <span class="limitLength" v-if="!riskDetailData.newDesc">0/200</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item amount_item"
            style="margin-right:72px;"
            label="收入影响额(RMB)："
          >
            <el-input placeholder="请输入" v-model="riskDetailData.incomeAffected"></el-input>
          </el-form-item>
          <el-form-item
            class="riskPresent_item amount_item"
            style="margin-right:0;"
            label="成本影响额(RMB)："
          >
            <el-input placeholder="请输入" v-model="riskDetailData.costAffected"></el-input>
          </el-form-item>
          <el-form-item class="riskPresent_item detailDescribe" label="解决方案：" prop="solution">
            <el-input
              type="textarea"
              style="position:relative;"
              class="describeTextarea"
              placeholder="请输入解决方案"
              v-model="riskDetailData.solution"
            ></el-input>
            <span
              class="limitLength"
              v-if="riskDetailData.solution"
            >{{riskDetailData.solution.length}}/200</span>
            <span class="limitLength" v-if="!riskDetailData.solution">0/200</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item"
            style="width:305px;margin-right:64px;"
            label="类别："
            prop="classification"
          >
            <el-select
              v-model="riskDetailData.classification"
              style="width:217px;"
              placeholder="请选择"
              @change="classChange"
            >
              <el-option
                v-for="item of searchConfig.classificationArr"
                v-if="item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="riskPresent_item"
            style="width:305px;margin-right:0px;"
            label="子类别："
            prop="subclass"
          >
            <el-select
              v-model="riskDetailData.subclass"
              filterable
              allow-create
              default-first-option
              style="width:217px;"
              placeholder="请选择"
            >
              <el-option
                v-for="item of subclassArr"
                v-if="item.value"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="riskPresent_item"
            style="width:305px;margin-right:64px;"
            label="责任人："
            prop="dutyPersonNo"
          >
            <el-select
              v-model="riskDetailData.dutyPersonNo"
              style="width:217px;"
              @change="memberChange"
              filterable
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
            class="riskPresent_item noRequire"
            style="width:305px;margin-right:0px;"
            label="责任部门："
          >
            <el-select
              v-model="riskDetailData.dutyDept"
              style="width:217px;"
              filterable
              placeholder="请选择"
            >
              <el-option
                v-for="(item,index) of wbsGroupArr"
                :key="index"
                :label="item.projectModuleCN"
                :value="item.projectModuleCN"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="riskPresent_item noRequire"
            style="width:290px;margin-right:80px;"
            label="计划开始："
          >
            <el-date-picker
              v-model="riskDetailData.planStartDate"
              style="width:216px;"
              type="date"
              :picker-options="pickerOptions0"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            class="riskPresent_item noRequire"
            style="width:290px;margin-right:0px;"
            label="计划完成："
          >
            <el-date-picker
              v-model="riskDetailData.planEndDate"
              style="width:216px;"
              :picker-options="pickerOptions1"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <div class="riskPresent" v-if="(activeName==3||activeName==4)||riskDetailData.isAccepted==1">
        <el-form
          :model="riskDetailData"
          :rules="rules"
          ref="riskDetailData"
          label-width="88px"
          label-position="left"
          class="demo-ruleForm"
        >
          <el-form-item
            class="riskPresent_item riskPresent_detail"
            label="问题/风险："
            prop="problemOrRisk"
          >
            <span
              v-if="riskDetailData.problemOrRisk"
            >{{problemOrRiskObj[riskDetailData.problemOrRisk]}}</span>
            <span v-if="!riskDetailData.problemOrRisk">无</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail"
            label="重要性："
            prop="importanceLevel"
          >
            <span v-if="!riskDetailData.importanceLevel">无</span>
            <span
              v-if="riskDetailData.importanceLevel"
            >{{searchConfig.urgentLevelObj[riskDetailData.importanceLevel]}}</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail"
            style="margin-right:0;"
            label="紧急性："
            prop="urgentLevel"
          >
            <span v-if="!riskDetailData.urgentLevel">无</span>
            <span
              v-if="riskDetailData.urgentLevel"
            >{{searchConfig.urgentLevelObj[riskDetailData.urgentLevel]}}</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item detailDescribe riskPresent_detail"
            label="详细描述："
            prop="newDesc"
          >
            <span style="display:inline-block;line-height:20px;" v-if="!riskDetailData.newDesc">无</span>
            <span
              style="display:inline-block;line-height:20px;"
              v-if="riskDetailData.newDesc"
            >{{riskDetailData.newDesc}}</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item amount_item riskPresent_detail"
            style="margin-right:72px;"
            label="收入影响额(RMB)："
          >
            <span v-if="!riskDetailData.incomeAffected">无</span>
            <span v-if="riskDetailData.incomeAffected">{{riskDetailData.incomeAffected}}</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item amount_item riskPresent_detail"
            style="margin-right:0;"
            label="成本影响额(RMB)："
          >
            <span v-if="!riskDetailData.costAffected">无</span>
            <span v-if="riskDetailData.costAffected">{{riskDetailData.costAffected}}</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail detailDescribe"
            label="解决方案："
            prop="solution"
          >
            <span style="display:inline-block;line-height:20px;" v-if="!riskDetailData.solution">无</span>
            <span
              style="display:inline-block;line-height:20px;"
              v-if="riskDetailData.solution"
            >{{riskDetailData.solution}}</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail"
            style="width:305px;margin-right:64px;"
            label="类别："
            prop="classification"
          >
            <span v-if="!riskDetailData.classification">无</span>
            <span
              v-if="riskDetailData.classification"
            >{{searchConfig.classificationObj[riskDetailData.classification]}}</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail"
            style="width:305px;margin-right:0px;"
            label="子类别："
            prop="subclass"
          >
            <span
              v-if="!searchConfig.subClassObj[riskDetailData.subclass]&&!riskDetailData.subclass"
            >{{riskDetailData.subclass}}</span>
            <span
              v-if="!searchConfig.subClassObj[riskDetailData.subclass]&&!riskDetailData.subclass"
            >无</span>
            <span
              v-if="searchConfig.subClassObj[riskDetailData.subclass]"
            >{{searchConfig.subClassObj[riskDetailData.subclass]}}</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail"
            style="width:305px;margin-right:64px;"
            label="责任人："
            prop="dutyPersonName"
          >
            <span v-if="riskDetailData.dutyPersonName">{{riskDetailData.dutyPersonName}}</span>
            <span v-if="!riskDetailData.dutyPersonName">无</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail noRequire"
            style="width:305px;margin-right:0px;"
            label="责任部门："
          >
            <span v-if="riskDetailData.dutyDept">{{riskDetailData.dutyDept}}</span>
            <span v-if="!riskDetailData.dutyDept">无</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail noRequire"
            style="width:290px;margin-right:80px;"
            label="计划开始："
          >
            <span v-if="riskDetailData.planStartDate">{{riskDetailData.planStartDate}}</span>
            <span v-if="!riskDetailData.planStartDate">无</span>
          </el-form-item>
          <el-form-item
            class="riskPresent_item riskPresent_detail noRequire"
            style="width:290px;margin-right:0px;"
            label="计划完成："
          >
            <span v-if="riskDetailData.planEndDate">{{riskDetailData.planEndDate}}</span>
            <span v-if="!riskDetailData.planEndDate">无</span>
          </el-form-item>
          <el-form-item
            v-if="riskDetailData.isAccepted==1"
            class="riskPresent_item riskPresent_detail detailDescribe"
            label="挂起原因"
            prop="solution"
          >
            <span style="display:inline-block;line-height:20px;" v-if="!riskDetailData.leftReason">无</span>
            <span
              style="display:inline-block;line-height:20px;"
              v-if="riskDetailData.leftReason"
            >{{riskDetailData.leftReason}}</span>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-item>
  </div>
</template>
<script>
import searchConfig from '../config/search.config.json';
export default {
  props: [
    'analysisIconfont',
    'activeName',
    'riskDetailData',
    'subclassArr',
    'memberData',
    'wbsGroupArr'
  ],
  data() {
    return {
      pickerOptions0: {
        disabledDate: (time) => {
          if (this.riskDetailData.planEndDate) {
            return (
              time.getTime() >=
              new Date(this.riskDetailData.planEndDate.toString()).getTime() *
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
          if (this.riskDetailData.planStartDate) {
            return (
              time.getTime() <=
              new Date(this.riskDetailData.planStartDate.toString()).getTime()
            );
          }
        }
      },
      searchConfig: searchConfig,
      fileList: [],
      problemOrRiskObj: {
        PROBLEM: '问题',
        RISK: '风险'
      },
      rules: {
        problemOrRisk: [{ required: true, message: '请选择', trigger: 'blur' }],
        importanceLevel: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        urgentLevel: [{ required: true, message: '请选择', trigger: 'blur' }],
        newDesc: [
          { required: true, message: '请输入详情描述', trigger: 'blur' }
        ],
        solution: [
          { required: true, message: '请输入解决方案', trigger: 'blur' }
        ],
        classification: [
          { required: true, message: '请选择', trigger: 'blur' }
        ],
        subclass: [{ required: true, message: '请选择', trigger: 'blur' }],
        dutyPersonNo: [{ required: true, message: '请选择', trigger: 'blur' }],
        dutyPersonName: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    };
  },
  created() {},
  methods: {
    //选择责任人
    memberChange(val) {
      for (let item of this.memberData) {
        if (val == item.userName) {
          this.riskDetailData.dutyPersonName = item.displayName;
        }
      }
    },
    //类别变化
    classChange(selectValue) {
      this.riskDetailData.subclass = '';
      for (let item of this.searchConfig.classificationArr) {
        if (selectValue == item.value) {
          //   this.subclassArr = item.children;
          this.$emit('update:subclassArr', item.children);
        }
      }
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
  .amount_item {
    padding-left: 10px;
    width: 300px !important;
    /deep/ .el-form-item__label {
      width: 140px !important;
    }
    /deep/ .el-form-item__content {
      margin-left: 140px !important;
    }
  }
  &_item {
    width: 210px;
    display: inline-block;
    margin-right: 20px;
    margin-bottom: 20px;
    position: relative;
    .limitLength {
      position: absolute;
      right: 10px;
      bottom: 0px;
      color: #777a80;
      font-size: 14px;
    }
    /deep/ .el-input__icon {
      line-height: 30px;
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



