<template>
  <div class="feedbackBox">
    <div class="feedbackBox_nav">
      <span class="feedbackBox_nav_title">风险及问题维护</span>
      <div class="feedbackBox_nav_btn">
        <span
          class="commonBtn commonConfirmBtn feedbacBtn"
          style="margin-right:15px;"
          v-if="permissionBtns.includes('新增')"
          @click="addBtn"
        >新增</span>
        <span
          class="commonBtn commonConfirmBtn feedbacBtn"
          v-if="permissionBtns.includes('导出')"
          @click="exportBtn"
        >导出</span>
      </div>
    </div>
    <div class="feedbackBox_search">
      <span class="feedbackBox_search_item">
        <label class="feedbackBox_search_item_label">标题：</label>
        <el-input
          size="mini"
          class="feedbackBox_search_item_ipt"
          v-model="searchData.obj.title"
          type="text"
          placeholder="请输入标题"
        ></el-input>
      </span>
      <span class="feedbackBox_search_item" style="margin-right:15px;">
        <label class="feedbackBox_search_item_label">提出人：</label>
        <el-input
          size="mini"
          class="feedbackBox_search_item_ipt"
          v-model="searchData.obj.proposePerson"
          type="text"
          placeholder="请输入提出人"
        ></el-input>
      </span>
      <span class="commonBtn commonConfirmBtn feedbacBtn" @click="searchBtn">搜索</span>
    </div>
    <div class="feedbackBox_search" style="margin-top:0px;">
      <div class="feedbackBox_search_item">
        <label class="feedbackBox_search_item_label">状态：</label>
        <div class="feedbackBox_search_item_selectBox">
          <el-select v-model="searchData.obj.status" size="mini">
            <el-option
              v-for="item in searchConfig.statusArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="feedbackBox_search_item">
        <label class="feedbackBox_search_item_label">重要性：</label>
        <div class="feedbackBox_search_item_selectBox">
          <el-select v-model="searchData.obj.importanceLevel" size="mini">
            <el-option
              v-for="item in searchConfig.importanceLevelArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="feedbackBox_search_item">
        <label class="feedbackBox_search_item_label">紧急程度：</label>
        <div class="feedbackBox_search_item_selectBox">
          <el-select v-model="searchData.obj.urgentLevel" size="mini">
            <el-option
              v-for="item in searchConfig.urgentLevelArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="feedbackBox_search_item">
        <label class="feedbackBox_search_item_label">问题来源：</label>
        <div class="feedbackBox_search_item_selectBox">
          <el-select v-model="searchData.obj.proposeDept" size="mini">
            <el-option
              v-for="item in searchConfig.proposeDeptArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="feedbackBox_search_item">
        <label class="feedbackBox_search_item_label">业务领域：</label>
        <div class="feedbackBox_search_item_selectBox">
          <el-select v-model="searchData.obj.businessLand" size="mini">
            <el-option
              v-for="item in searchConfig.businessAreaArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="feedbackBox_content">
      <el-table
        highlight-current-row
        :data="tableData.problemVOList"
        :height="windowHeight"
        width="1400px"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="status" label="状态" width="90">
          <template slot-scope="scope">{{searchConfig.statusObj[scope.row.status]}}</template>
        </el-table-column>
        <el-table-column prop="serialNo" label="编号" width="160">
          <template slot-scope="scope">
            <span class="riskNumber" @click="modifyRiskBtn(scope.row)">{{scope.row.serialNo}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题" min-width="280">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              v-if="scope.row.title.length>17"
              :content="scope.row.title"
              placement="top"
            >
              <span class="riskRecordTitle">{{scope.row.title}}</span>
            </el-tooltip>
            <span class="riskRecordTitle" v-if="scope.row.title.length<=17">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="proposePersonName" label="提出人" width="120"></el-table-column>
        <el-table-column prop="proposeDept" label="问题来源" width="110">
          <template slot-scope="scope">{{searchConfig.proposeDeptObj[scope.row.proposeDept]}}</template>
        </el-table-column>
        <el-table-column prop="proposeDate" label="提出日期" width="120"></el-table-column>
        <el-table-column prop="businessArea" width="180" label="业务领域">
          <template slot-scope="scope">
            <span
              class="businessAreaInfo"
              v-for="(item,index) of scope.row.businessArea"
              :key="item"
              v-if="index<(scope.row.businessArea.length-1)"
            >{{searchConfig.businessAreaObj[item]}},</span>
            <span
              class="businessAreaInfo"
              v-for="(item,index) of scope.row.businessArea"
              :key="item"
              v-if="index==(scope.row.businessArea.length-1)"
            >{{searchConfig.businessAreaObj[item]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="importanceLevel" label="重要性" width="80">
          <template slot-scope="scope">
            <span>{{searchConfig.urgentLevelObj[scope.row.importanceLevel]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="urgentLevel" label="紧急性" width="80">
          <template slot-scope="scope">
            <span>{{searchConfig.urgentLevelObj[scope.row.urgentLevel]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="planEndDate" label="计划完成日期" width="120"></el-table-column>
        <el-table-column prop="dutyPersonName" label="责任人"></el-table-column>
        <el-table-column prop="closeDate" label="关闭日期" width="120"></el-table-column>
      </el-table>
    </div>
    <div class="model-pagination-wrap nISDP-pagination-wrap" style="text-align:right;">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="10"
        layout="total, prev, pager, next, sizes, jumper"
        :total="tableData.count"
      ></el-pagination>
    </div>
    <add-risk
      v-if="addFeedbackVisible"
      :searchConfig="searchConfig"
      :addFeedbackVisible.sync="addFeedbackVisible"
      :getRiskproblemList="getRiskproblemList"
      :selectRiskIitem.sync="selectRiskIitem"
    ></add-risk>
    <modify-feedback
      v-if="modifyFeedbackVisible"
      :modifyFeedbackVisible.sync="modifyFeedbackVisible"
      :getRiskproblemList="getRiskproblemList"
      :searchConfig="searchConfig"
      :selectRiskIitem.sync="selectRiskIitem"
    ></modify-feedback>
  </div>
</template>
<script>
import searchConfig from './config/search.config.json';
import addRisk from './components/addRisk.vue';
import modifyFeedback from './components/modifyFeedback.vue';
import { mapState } from 'vuex';
export default {
  components: {
    addRisk,
    modifyFeedback
  },
  data() {
    return {
      selectRiskIitem: {},
      modifyFeedbackVisible: false,
      addFeedbackVisible: false,
      searchConfig,
      windowHeight: window.innerHeight - 350,
      searchData: {
        pageNum: 1,
        pageCount: 10,
        sortType: '',
        obj: {
          proposePerson: '',
          title: '',
          proposeDept: '',
          status: '',
          importanceLevel: '',
          urgentLevel: '',
          businessLand: '',
          projectId: this.$route.query.id
        }
      },

      tableData: {}
    };
  },
  computed: {
    ...mapState({
      permissionBtns: (state) => {
        const menuData = state.ISDP.common.currentMenu || {};
        return menuData.btns || [];
      }
    }),
    projectId() {
      const { projectId, id } = this.$route.query;
      return projectId || id;
    }
  },
  created() {
    this.getRiskproblemList();
  },
  methods: {
    //导出
    async exportBtn() {
      const result = await this.$store.dispatch(
        'ISDP/operationManage/downexcel',
        { projectId: this.projectId }
      );
      if (result && result.data) {
        this.$download(result.data, '问题与风险维护列表.xlsx');
      }
    },
    //设置表格样式
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return 'warning-row';
      }
      return '';
    },
    //获取列表
    async getRiskproblemList() {
      const { data, resultCode = '' } = await this.$store.dispatch(
        'ISDP/operationManage/getRiskproblemList',
        this.searchData
      );
      if (+resultCode === '200' || resultCode.includes('200')) {
        this.tableData = data;
      }
    },
    //搜索
    searchBtn() {
      this.searchData.pageNum = 1;
      this.getRiskproblemList();
    },
    handleSizeChange(val) {
      this.searchData.pageCount = val;
      this.getRiskproblemList();
    },
    handleCurrentChange(val) {
      this.searchData.pageNum = val;
      this.getRiskproblemList();
    },
    //新增
    addBtn() {
      this.addFeedbackVisible = true;
    },
    //修改风险
    modifyRiskBtn(item) {
      this.selectRiskIitem = item;
      this.modifyFeedbackVisible = true;
    }
  }
};
</script>
<style socped lang="less">
@import url('./feedback.less');
</style>
<style lang="less">
//公用弹窗底部按钮
.commonDialog /deep/ .el-dialog__footer {
  padding: 10px 14px 10px 0 !important;
}
.el-textarea__inner:focus {
  border-color: #f00000 !important;
}
.el-date-table /deep/ td.current:not(.disabled) span {
  background-color: #f00000 !important;
}
.el-input__inner:focus {
  border-color: #f00000 !important;
}
.el-date-table td.available:hover {
  color: #ff3535;
}
//单选框公用样式
.el-radio {
  margin-right: 56px !important;
}
.el-radio /deep/ .el-radio__inner {
  border: 2px solid #7c7c7c;
}
.el-radio /deep/ .el-radio__input.is-checked .el-radio__inner {
  background: #ffffff;
  border-color: red;
}
.el-radio /deep/ .el-radio__input.is-checked .el-radio__inner::after {
  content: '';
  display: block;
  background-color: red;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.el-radio /deep/ .el-radio__label {
  color: #333333 !important;
  font-size: 14px;
}
//el-input样式
.el-input.is-active .el-input__inner,
.el-input__inner:focus {
  border-color: #f00000 !important;
}
.noRequire {
  /deep/ .el-form-item__label {
    padding-left: 12px !important;
  }
}
.el-select-dropdown__item.selected {
  color: #f00000;
}
.el-select .el-input.is-focus .el-input__inner {
  border-color: #f00000;
}
.el-select .el-input__inner:focus {
  border-color: #f00000;
}
.el-input .el-input__inner {
  height: 30px;
}
.model-pagination-wrap {
  &.nISDP-pagination-wrap {
    background-color: #fff;
    .el-pagination {
      margin: 0;
      padding: 16px 24px;
      color: #777a80;
      font-size: 14px;
      .el-pagination__total,
      .el-pagination__jump {
        color: #777a80;
        font-size: 14px;
      }
      .el-pagination__jump {
        margin-left: 0;
      }
      .btn-prev,
      .btn-next {
        background-color: #f5f5f5;
        .el-icon {
          color: rgba(164, 164, 164, 0.9);
        }
        &:not([disabled]):hover {
          background-color: #f42020;
          .el-icon {
            color: #fff;
          }
        }
        &[disabled] {
          background-color: #f5f5f5;
          .el-icon {
            color: rgba(205, 205, 205, 0.9);
          }
        }
      }
      .el-pager {
        .number {
          border-radius: 0;
          background-color: transparent;
          color: #777a80;
          font-weight: 500;
          &.active {
            background-color: #f42020;
          }
        }
      }
      .el-pagination__sizes {
        margin: 0 16px 0 11px;
        .el-input {
          width: 88px;
          .el-input__inner {
            height: 24px;
            border: 0;
            background-color: #f5f5f5;
            color: #777a80;
            font-size: 14px;
          }
        }
      }
      .el-pagination__editor {
        .el-input__inner {
          width: 40px;
          height: 24px;
          border: 0;
          background-color: #f5f5f5;
          color: #777a80;
          font-size: 14px;
        }
      }
    }
  }
}
.model-pagination-dropdown {
  min-width: unset;
  width: 88px;
  margin-top: 0;
  border: 0;
  box-shadow: 0px 0px 14px 0px rgba(216, 213, 213, 0.6);
  border-radius: 1px;
  .popper__arrow {
    display: none;
  }
  .el-select-dropdown__list {
    padding: 0;
    .el-select-dropdown__item {
      padding: 0 10px;
      color: #4d4f53;
      font-size: 14px;
      &.hover,
      &.selected,
      &:hover {
        color: #f00000;
        font-weight: 500;
      }
    }
  }
}
</style>
