<template>
  <div class="extermalField"
       :key="$route.name">
    <inside-head :options="headConfig.power"
                 :key="Math.random()"
                 :form="exportParams"
                 @callback="callback"></inside-head>
    <!-- 弹窗 -->
    <el-dialog title="派发"
               :close-on-click-modal="false"
               :visible.sync="dialogTableVisible">
      <el-form :model="form"
               size="small">
        <el-form-item label="姓名"
                      :label-width="formLabelWidth">
          <el-select v-model="form.staff"
                     placeholder="请选择人员"
                     :filterable="true"
                     @change="select">
            <el-option v-for="(v,index) in form.staffs"
                       :key="index"
                       :value="v"
                       @change="select">
            </el-option>
            <!-- :fetch-suggestions="querySearchStaff" -->
          </el-select>
        </el-form-item>
        <el-form-item label="工号"
                      :label-width="formLabelWidth">
          <el-select v-model="form.staffno"
                     placeholder="人员工号"
                     :filterable="true"
                     @change="select">
            <el-option v-for="(v,index) in form.staffons"
                       :key="index"
                       :value="v"
                       @change="select">
            </el-option>
            <!-- :fetch-suggestions="querySearchStaff" -->
          </el-select>
        </el-form-item>
        <el-form-item label="工序"
                      :label-width="formLabelWidth">
          <el-checkbox-group v-model="form.procedures">
            <el-checkbox class="checkLi"
                         v-for="city in checkboxPersonConfig"
                         :label="city.id"
                         :key="city.id">{{city.text}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="dialogTableVisible=false">取消</el-button>
        <el-button @click="validateDistribute">确认</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗END -->
    <!-- 筛选选择框1 -->
    <el-container class="external-field-screen">
      <el-aside width="88px"
                class="screen-aside scrollbar">查看筛选：</el-aside>
      <el-main class="screen-main flex-wrap">
        <el-checkbox-group v-model="cities"
                           @change="screenChange"
                           class="scrollbar">
          <div class="checkbox-item">
            <el-checkbox class="screen-warp"
                         v-for="(item,index) of checkedCities"
                         :label="item.id"
                         :key="index+''"
                         :style="{width:item.width,minWidth:item.minWidth}">
              {{item.text}}
            </el-checkbox>
            <!--
            <el-checkbox class="screen-warp"
                         v-for="(item,index) of checkedCities.slice(10)"
                         :label="item.id"
                         :key="index+''"
                         :style="{width:item.width,minWidth:item.minWidth}">
              {{item.text}}
            </el-checkbox> -->
          </div>
        </el-checkbox-group>
      </el-main>
    </el-container>
    <!-- 筛选选择框END -->

    <model-table ref="insideTable"
                 :key="insideTableKey"
                 :data="$route.name=='ISDPProgressExternalFeedback'?(feedbackTabel&&feedbackTabel.content):(contentList&&contentList.content)"
                 :pagination="taskPagination"
                 :options="$route.name=='ISDPProgressExternalFeedback'?(titleConfig2):(titleConfig)"
                 @callback="callback"></model-table>
  </div>
</template>
<script>
import insideHead from '@ISDP/components/insideHead';

import checkboxConfig from './config/checkbox.list';
import checkboxPersonConfig from './config/checkbox.person.list';
import tableConfig from './config/content.title';

import headOpts from './config/head.config';
import headFeedbackConfig from './config/head.config.externalFeedback';
import { mapState } from 'vuex';
const titleConfig2 = tableConfig.toJson();
titleConfig2.columns.shift();
const modelTable = () => import('@/components/modelList/modelTable');
const checkedAll = checkboxConfig.map((item) => item.id);
export default {
  data() {
    return {
      keys: 1,
      checkedCities: checkboxConfig.sort(function(next, prev) {
        return next.id - prev.id;
      }),
      cities: checkedAll.toJson(),
      isCheckboxAll: true,
      isIndeterminate: true,
      titleConfig: tableConfig.toJson(),
      titleConfig2,
      dialogTableVisible: false,
      checkboxPersonConfig,
      form: {
        ids: [],
        staff: null,
        staffno: null,
        procedures: [],
        staffs: [],
        staffons: [],
        select: []
      },
      formLabelWidth: '55px',
      // headConfig: [],
      contentList: {},
      taskPagination: {
        theme: 'isdp',
        current: 1,
        layout: 'total,prev,pager,next,sizes,jumper',
        pageSize: 10,
        pageSizes: [ 5, 10, 15, 20 ],
        total: 20
      },
      feedbackTabel: {},
      insideTableKey: 1,
      exportParams: {
        type: 0,
        projectId: this.$route.query.projectId || this.$route.query.id || '',
        staffno: this.$store.state.common.userinfo.username
      }
    };
  },
  computed: {
    ...mapState({
      headConfig(state) {
        const { name: routeName } = this.$route,
          menuData = state.ISDP.common.currentMenu || {},
          { btns = [] } = menuData,
          resultData =
              routeName === 'ISDPProgressExternalFeedback'
                ? headFeedbackConfig.toJson()
                : headOpts.toJson();
        resultData.btns = resultData.power.btns.filter((item) =>
          btns.includes(item.text)
        );
        return resultData;
      }
    }),
    projectId() {
      const { projectId, id } = this.$route.query;
      return projectId || id;
    }
  },
  created() {},
  beforeRouteEnter(to, from, next) {
    next((Vn) => {
      Vn.routerStart(to);
    });
  },

  components: {
    modelTable,
    insideHead
  },
  methods: {
    //路由初始 子计划or 反馈
    routerStart(to) {
      const { name: routeName } = to;
      this.taskPagination.current = 1;
      this.taskPagination.pageSize = 10;
      routeName == 'ISDPProgressExternalFeedback'
        ? this.feedbackChildPlan()
        : this.getChildPlanList();
    },
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },

    //获取子计划列表...
    async getChildPlanList() {
      const { data, resultCode, resultMessage } = await this.$store.dispatch(
        'ISDP/progressManage/getChildPlanList',
        {
          pageNum: this.taskPagination.current,
          pageCount: this.taskPagination.pageSize,
          obj: {
            projectId: this.projectId || ''
          }
        }
      );
      if (resultCode == '200' && data) {
        this.contentList = data.toJson();
        this.taskPagination.total = data.totalElements;
        this.form.ids = [];
      } else {
        this.$elTooltip({ message: resultMessage, type: 'error' });
      }
    },
    //子计划反馈列表
    async feedbackChildPlan() {
      let { current = 1, pageSize = 5 } = this.taskPagination;
      const { data, resultCode, resultMessage } = await this.$store.dispatch(
        'ISDP/progressManage/feedbackChildPlan',
        {
          pageNum: current,
          pageCount: pageSize,
          obj: {
            staffno: this.$store.state.common.userinfo.username || '',
            projectId: this.projectId || ''
          }
        }
      );

      if (resultCode == '200' && data) {
        this.feedbackTabel = data.toJson();
        this.taskPagination.total = data.totalElements;
      } else {
        this.$elTooltip({ message: resultMessage, type: 'error' });
      }
    },

    //分页事件
    paginationCallback(num) {
      this.taskPagination.current = num;
      const { name: routeName } = this.$route;
      routeName == 'ISDPProgressExternalFeedback'
        ? this.feedbackChildPlan()
        : this.getChildPlanList();
    },
    pagiantionSizeChange(num) {
      this.taskPagination.current = 1;
      this.taskPagination.pageSize = num;
      const { name: routeName } = this.$route;
      routeName == 'ISDPProgressExternalFeedback'
        ? this.feedbackChildPlan()
        : this.getChildPlanList();
    },
    headleselectionChange(selection) {
      const ids = [];
      selection.forEach((value, index) => {
        ids[index] = value.id;
      });
      this.form.ids = ids.toJson();
    },

    //子计划已发布列表请求...
    async getChildPlanReleaseList(powerItem) {
      // {  json配置
      //   "text": "查看发布状态",
      //   "fnName": "getChildPlanReleaseList"
      // },
      if (powerItem.text == '查看发布状态') {
        powerItem.text = '返回';
        const { data, resultCode } = await this.$store.dispatch(
          'ISDP/progressManage/getChildPlanReleaseList',
          {
            pageNum: this.taskPagination.current,
            pageCount: this.taskPagination.pageSize,
            obj: {
              projectId: this.projectId || ''
            }
          }
        );
        if (resultCode == '200' && data) {
          this.contentList = data.toJson();
          this.taskPagination.total = data.totalElements;
        }
      } else {
        powerItem.text = '查看发布状态';
        this.getChildPlanList();
      }
    },
    //导入...成功
    onSuccessForUpload(enent, a) {
      const { response } = a,
        { resultCode, resultMessage } = response;
      if (resultCode == 200) {
        this.$elTooltip({ message: resultMessage, type: 'success' });
        this.$route.name != 'ISDPProgressExternalFeedback'
          ? this.getChildPlanList()
          : this.feedbackChildPlan();
      } else {
        this.$elTooltip({ message: resultMessage, type: 'error' });
      }
    },
    //导出
    async exportChildPlanExcel() {
      const { name: routeName } = this.$route;
      routeName == 'ISDPProgressExternalFeedback'
        ? (this.exportParams.type = 1)
        : (this.exportParams.type = 0);
      const result = await this.$store.dispatch(
        'ISDP/progressManage/exportChildPlanExcel',
        this.exportParams
      );
      if (result.status !== 200) {
        this.$elTooltip({ message: result.resultMessage, type: 'error' });
      } else {
        let { name: routeName } = this.$route,
          name = '';
        routeName == 'ISDPProgressExternalFeedback'
          ? (name = '项目计划反馈列表.xlsx')
          : (name = '项目计划列表.xlsx');
        this.$download(result.data, name);
        this.$alert(
          '模板只能修改标黄部分<br />计划完成时间为空可以修改',
          '提示',
          {
            confirmButtonText: '确定',
            dangerouslyUseHTMLString: true,
            type: 'warning'
          }
        );
      }
    },
    // 导入
    async importChildPlanExcel() {
      const result = await this.$store.dispatch(
        'ISDP/progressManage/importChildPlanExcel',
        this.exportParams
      );
      if (result.resultCode != 200) {
        this.$elTooltip({ message: result.resultMessage, type: 'error' });
      } else if (result.resultMessage || result.message) {
        this.$elTooltip({ message: result.resultMessage, type: 'success' });
      }
    },
    //发布
    async issueChildPlan() {
      const { resultMessage, resultCode } = await this.$store.dispatch(
        'ISDP/progressManage/issueChildPlan',
        { projectId: this.projectId || '' }
      );
      if (resultMessage && resultCode == 200) {
        this.$elTooltip({ message: resultMessage, type: 'success' });
      } else {
        this.$elTooltip({ message: resultMessage, type: 'error' });
      }
    },

    //派发前校验
    async validateDistribute() {
      if (this.form.procedures.length < 1) {
        this.$elTooltip({ message: '请选择发布项目', type: 'error' });
        return;
      }
      let procedures = this.form.procedures.join();
      const setData = {
        ids: this.form.ids.join(',') || '',
        staff: this.form.staff || '',
        staffno: this.form.staffno || '',
        procedures,
        projectId: this.projectId || ''
      };
      const { resultMessage, resultCode } = await this.$store.dispatch(
        'ISDP/progressManage/validateDistribute',
        setData
      );
      if (resultCode == 200) {
        await this.distributeChildPlan(setData);
      } else if (resultCode == 500) {
        this.$confirm(resultMessage + ',是否替换', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.distributeChildPlan(setData);
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消派发'
            });
          });
      }
    },
    //派发 distributeChildPlan
    distributeChildPlanRedact() {
      if (this.form.ids.length < 1) {
        this.$elTooltip({ message: '请选择派发选项', type: 'warning' });
      } else {
        this.dialogTableVisible = true;
        this.queryChildPlanPerson();
      }
    },
    async distributeChildPlan(setData) {
      // let procedures = this.form.procedures.join();
      // const setData = {
      //   ids: this.form.ids.join(',') || '',
      //   staff: this.form.staff || '',
      //   staffno: this.form.staffno || '',
      //   procedures
      // };
      const { resultMessage, resultCode } = await this.$store.dispatch(
        'ISDP/progressManage/distributeChildPlan',
        setData
      );
      if (resultCode == 200) {
        this.$elTooltip({ message: resultMessage, type: 'success' });
        this.dialogTableVisible = false;
        const { name: routeName } = this.$route;
        routeName == 'ISDPProgressExternalFeedback'
          ? this.feedbackChildPlan()
          : this.getChildPlanList();
        this.form.ids = [];
        this.form.procedures = [];
      } else {
        this.$elTooltip({ message: resultMessage, type: 'error' });
      }
    },

    //人员查询
    async queryChildPlanPerson() {
      const { data } = await this.$store.dispatch(
        'ISDP/progressManage/queryChildPlanPerson',
        { id: this.projectId || '' }
      );
      this.form.staffs = [];
      this.form.staffons = [];
      this.form.select = [];
      data.forEach((item) => {
        this.form.staffs.push(item.displayName);
        this.form.staffons.push(item.userName);
        this.form.select.push(item);
      });
    },
    //设置建议
    querySearchStaff(queryString, cd) {
      let restaurants = this.form.staffs;
      let results = queryString
        ? restaurants.filter(this.createFiter(queryString))
        : restaurants;
      cd(results);
    },
    querySearchStaffNo(queryString, cd) {
      let restaurants = this.form.staffons;
      let results = queryString
        ? restaurants.filter(this.createFiter(queryString))
        : restaurants;
      cd(results);
    },
    createFiter(queryString) {
      return (restsurant) =>
        restsurant.value.toLowerCase().indexOf(queryString.toLowerCase()) == 0;
    },
    select(item) {
      let isFind = this.form.select.find(
        (value) => value.displayName == item || value.userName == item
      );
      if (isFind) {
        this.form.staff = isFind.displayName;
        this.form.staffno = isFind.userName;
      }
    },
    //多选框事件
    screenChange() {
      if (this.isCheckboxAll) {
        this.isCheckboxAll = false;
        if (this.cities.includes(-10)) {
          this.cities.splice(this.cities.indexOf(-10), 1);
        } else {
          this.cities = [];
        }
      } else if (
        this.cities.includes(-10) ||
          this.cities.length == checkedAll.length - 1
      ) {
        this.isCheckboxAll = true;
        this.cities = checkedAll.toJson();
      }
      const { cities } = this,
        notChecked = checkedAll.filter((item) => !cities.includes(item)),
        insideTableConfig = tableConfig.toJson();
      const resultColumns = insideTableConfig.columns.filter(
        (item) => item.index && !notChecked.includes(item.index)
      );
      this.titleConfig.columns = resultColumns;
      let columns = resultColumns.toJson();
      columns.splice(
        resultColumns.toJson().findIndex((item) => item.index == 100),
        1
      );
      this.titleConfig2.columns = columns;
      this.insideTableKey++;
    }
  }
};
</script>
<style lang="less" scoped>
  .extermalField {
    .external-field-screen {
      font-size: 14px;
      line-height: 14px;
      color: #333333;
      .screen-aside {
        height: 50px;
        display: inline-block;
        font-size: 14px;
        color: #b1b2b5;
      }
      .screen-main {
        padding: 0 0 14px 0;
        .screen-warp {
          height: 34px;
          margin-right: 10px;
          .el-checkbox__label {
            line-height: 4px;
          }
        }
        .el-checkbox-group {
          .checkbox-item {
            display: flex;
            flex-wrap: wrap;
            .screen-warp {
              flex-basis: 138px;
            }
          }
        }
      }
    }

    .external-field-content {
      color: #e3ecfc;
      padding-top: 20px;
      .checkboxTitle {
        margin-bottom: 20px;
        height: 14px;
        flex: 1;
        display: inline-block;
        width: 90px;
        font-size: 14px;
        color: #b1b2b5;
      }
      .checkWarp {
        display: flex;
      }
      .checkAll {
        width: 100%;
        padding-left: 24px;
      }
      .el-checkbox {
        margin: 0;
        .el-checkbox__label {
          padding-left: 6px;
        }
      }
      .checkedList {
        width: 100%;
        .checkLi {
          width: 10%;
        }
        .checkLi2 {
          width: 10%;
        }
      }
      section.contentList {
        color: #ff0;
        .el-checkbox {
          &:first-child {
            padding-left: 24px;
          }
        }
      }
    }
    .contentList {
      margin-bottom: 24px;
    }
  }
</style>
<style lang="less">
  .extermalField {
    // 筛选
    .el-checkbox {
      margin: 0;
      .el-checkbox__label {
        padding-left: 6px;
      }
    }
    //弹窗
    .el-dialog {
      width: 512px;
      margin-top: 25vh !important;
      .el-dialog__header {
        padding: 15px 0 0 15px;
        height: 44px;
        line-height: 14px;
        font-size: 14px;
        box-shadow: 0px 2px 0px 0px #f4f3f3;
        .el-dialog__title {
          line-height: 14px;
          font-size: 14px;
        }
        .el-dialog__headerbtn {
          top: 10px;
        }
      }
      .el-dialog__body {
        padding-top: 35px;
        padding-bottom: 0;
        .el-form {
          width: 315px;
          margin: 0 auto;
          .el-form-item {
            display: flex;
            width: 315px;
            margin-bottom: 16px;
            &:last-child {
              margin-bottom: 0px;
            }
            .el-input,
            .el-input__inner {
              border-radius: 1px;
              outline: none;
              width: 260px;
              height: 30px;
            }
            .el-form-item__content {
              margin-left: 0 !important;
            }
            .el-form-item__label {
              width: 55px !important;
            }
            .el-form-item__content {
              width: 260px;
              .checkLi {
                width: 30%;
              }
            }
          }
        }
      }
      .el-dialog__footer {
        border-top: 1px solid #e5e5e5;
        padding: 14px;
        button.el-button {
          color: #e5e5e5;
          &:last-child {
            background-color: #f42020;
          }
        }
      }
    }
  }
</style>
