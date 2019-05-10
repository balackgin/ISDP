<template>
  <div class="webs-plan">
    <div class="txt"><span>{{projectModel === 'SMALL' ? '小项目计划' : 'WBS计划'}}</span><span class="line"></span></div>
    <!-- <div class="mb-1">

    </div> -->
    <div class="mb-1"
         v-if="+detailData.isConfirmProjectModel === 2">
      <div v-if="!detailData.planTemplateType && projectModel === 'LARGE' &&  projectManager && detailData.planApprovalStatus !== 'APPROVING'">
        <el-select size="small"
                   v-model="moduleValue">
          <el-option value="自定义模板">自定义模板</el-option>
          <el-option value="标准模板">标准模板</el-option>
        </el-select>
        <el-button type="danger"
                   class="add-list"
                   @click="selectModule">
          <i class="icon far fa-save"></i>
          选择
        </el-button>
      </div>
      <el-button type="danger"
                 size="small"
                 v-if="projectManager && !detailData.planTemplateType && projectModel === 'SMALL'"
                 @click="selectModule">载入模板</el-button>
      <!-- // cleanPlan -->
      <el-button type="danger"
                 size="small"
                 v-if="projectManager && (!detailData.planApprovalStatus || detailData.planApprovalStatus === 'NOT_COMMIT') && projectModel === 'LARGE' && detailData.planTemplateType && isCleanShow"
                 @click="handleClickForClean">清理模板</el-button>
      <el-button type="danger"
                 v-if="projectManager && detailData.planApprovalStatus !== 'APPROVING' && detailData.planTemplateType"
                 class="add-list"
                 @click="handleClickForSave(undefined)">
        <i class="icon far fa-save"></i>
        保存
      </el-button>

      <!-- || projectManagerSuperior && detailData.planApprovalStatus === 'APPROVING' -->
      <el-button v-if="projectManager && (!detailData.planApprovalStatus || ['NOT_PASS','NOT_COMMIT','PASS'].includes(detailData.planApprovalStatus)) && wbsData.length"
                 type="danger"
                 size="small"
                 @click="submitApproval">提交审批</el-button>
      <el-button v-if="projectManager && (!detailData.planApprovalStatus || ['NOT_PASS','NOT_COMMIT','PASS'].includes(detailData.planApprovalStatus)) && wbsData.length"
                 type="danger"
                 size="small"
                 @click="exportWBSExcel">导出Excel</el-button>
    </div>

    <section class="project-wbs-change-group"
             v-if="showApproval">
      <div class="pmc-box">
        <!-- <el-row>
          <el-row v-if="projectManagerSuperior">
            <el-col :span="2">申请理由：</el-col>
            <el-col :span="16">
              {{approvalList && approvalList[1] && approvalList[1].idea}}
            </el-col>
          </el-row>
          <br />
          <el-col :span="2">{{projectManagerSuperior ? '意见' : '申请理由'}}：</el-col>
          <el-col :span="16">
            <el-input type="textarea"
                      v-model="reason"></el-input>
          </el-col>
        </el-row> -->
        <el-form @submit.native.prevent
                 label-width="100px"
                 label-position="right">
          <el-form-item label="申请理由:"
                        v-if="projectManagerSuperior">
            {{approvalList[1] && approvalList[1].idea}}
          </el-form-item>
          <el-form-item :label="projectManagerSuperior ? (approvalType ? '通过' : '拒绝') + '意见:' : '申请理由:'">
            <el-input type="textarea"
                      v-model="reason"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger"
                       size="small"
                       class="pmc-btn"
                       @click="submitApproval">提交</el-button>
          </el-form-item>
        </el-form>

      </div>
    </section>
    <section>
      <el-button v-if="projectManager && detailData.planApprovalStatus !== 'APPROVING' && projectModel === 'LARGE' && customFlag"
                 type="danger"
                 class="add-list"
                 @click="handleClickForAddModule">
        <i class="icon fa fa-plus"></i>
        模块
      </el-button>
      <model-table :options="modelTableConfig"
                   :data="wbsData"
                   :fns="tableActions"
                   :remoteData="remoteData"
                   @callback="callback"></model-table>
    </section>

    <outside-dialog :show="dialogShow"
                    :form="dialogForm"
                    :remoteData="dialogRemoteData"
                    :options="taskDialog"
                    :rules="dialogRules"
                    @callback="dialogCallback"></outside-dialog>
    <outside-dialog :show="dialogCustomShow"
                    :form="dialogCustomForm"
                    :options="dialogCustomOpts"
                    :rules="dialogCustomRules"
                    @callback="dialogCustomCallback"></outside-dialog>
    <!-- <section v-if="approvalUrl">
      <iframe :src="approvalUrl"
              v-if="approvalUrl"
              class="frame w-100 mt-2"
              name="approval"
              frameborder="0"></iframe>
      <el-button class="refreshBtn"
                 v-show="false"
                 @click="refreshFn"></el-button>
    </section> -->
  </div>
</template>
<script>
import { mapState } from 'vuex';
import outsideDialog from '@/components/outsideDialog';
import modelTable from '@/components/modelList/modelTable';
// import manageData from '../config/data.manage.json';
// import smallWBSDialog from './config/wbs.small.dialog.json';
// import largeWBSDialog from './config/wbs.large.dialog.json';
import smallTableConfig from './config/wbs.small.config.json';
import largeTableConfig from './config/wbs.large.config.json';
import dialogConfig from './config/task.dialog.json';
// const LARGE_MODEL = {
//   BUSINESS_GROUP: [],
//   PRE_SALE_GROUP: [],
//   DELIVERY_GROUP: [],
//   FINANACE_LEGAL_GROUP: [],
//   PURCHASE_GROUP: [],
//   SUPPORT_GROUP: []
// };

const appendIcons = [
  {
    name: 'assignment',
    title: '任务分派',
    text: '分派'
  },
  {
    text: '新增',
    name: 'handleClickForIconAdd'
  },
  {
    name: 'remove',
    title: '删除',
    className: 'text-danger',
    text: '删除'
  }
];

const appendEle = {
  id: '',
  jobDescription: '',
  name: '',
  dutyDept: '',
  dutyPersonName: '',
  dutyPersonNo: '',
  planEndDate: '',
  planStartDate: '',
  supportPersonName: '',
  supportPersonNo: '',
  weight: 0,
  children: [],
  isMustFill: null
};

  // const WBSFirstLevel = [ 'BUSINESS_GROUP', 'PRE_SALE_GROUP', 'DELIVERY_GROUP', 'FINANACE_LEGAL_GROUP', 'PURCHASE_GROUP', 'SUPPORT_GROUP' ];
  // 商务  售前 交付  财经法务  采购  支撑

const { taskDialog, customDialog } = dialogConfig;
export default {
  components: {
    modelTable,
    outsideDialog
  },
  data() {
    const validateFn = (msg) => (rule, value, callback) => {
      if (value) {
        callback();
      } else {
        this.$elMessage({
          message: msg,
          type: 'error'
        });
        callback(new Error(msg));
      }
    };
    return {
      // modelTableConfig: largeTableConfig.tableConfig,
      wbsData: [],
      wbsOldData: [],
      listResultData: {},
      remoteData: {},
      sessionHideRow: [],
      isCleanShow: true,
      // approval
      // approval
      // approval
      showApproval: false,
      reason: '',
      approvalType: null,
      // approval
      // approval
      // approval
      // 自定义模板
      moduleValue: '',
      // 自定义模板
      // 审批流
      approvalUrl: '',
      // 审批流
      // dialog start
      // dialog start
      // dialog start
      dialogCustomShow: false,
      dialogCustomOpts: customDialog,
      dialogCustomForm: customDialog.data.toJson(),
      dialogCustomFormTem: null,
      dialogCustomRules: {
        first: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value || Number.isNaN(+value) || +value < 0) {
                const msg = '请输入大于0的数字!';
                this.$elMessage({
                  message: msg,
                  type: 'error'
                });
                callback(new Error(msg));
              } else {
                callback();
              }
            }
          }
        ],
        second: [
          {
            required: true,
            trigger: 'blur',
            validator: (rule, value, callback) => {
              if (!value || Number.isNaN(+value) || +value < 0) {
                const msg = '请输入大于0的数字!';
                this.$elMessage({
                  message: msg,
                  type: 'error'
                });
                callback(new Error(msg));
              } else {
                callback();
              }
            }
          }
        ]
      },
      // task 任务派发
      dialogShow: false,
      dialogRemoteData: {},
      dialogFormTem: null,
      dialogForm: JSON.parse(JSON.stringify(taskDialog.data)),
      taskDialog, //任务派发
      dialogRules: {
        taskClassify: [
          {
            required: true,
            validator: validateFn('请选择重要级别!')
          }
        ],
        overdue: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (value === '') {
                let msg = '请选择任务状态!';
                this.$elMessage({
                  message: msg,
                  type: 'error'
                });
                callback(new Error(msg));
              } else {
                callback();
              }
            }
          }
        ],
        receiverName: [
          {
            required: true,
            validator: validateFn('请选择任务接收人!')
          }
        ],
        feedbackRule: [
          {
            required: true,
            validator: validateFn('请选择反馈频率!')
          }
        ]
      },
      // dialog end
      // dialog end
      // dialog end
      tableActions: {
        rowClassName: (row) => {
          let className = [];
          // row.childrenId && className.push('strong-txt');
          if (
            row.parentId &&
              this.sessionHideRow &&
              this.sessionHideRow.includes(row.parentId)
          ) {
            className.push('hide-row');
          } else {
            className.push('show-row');
          }
          className.push(row.className);
          return className.join(' ');
        },
        cellClassName: (row, column, rowIndex, columnIndex) => {
          let className = [];
          let span = row._span,
            configArr = span && span.config;
          (+row.level === 1 || +row.level === 2) &&
              [ 'jobDescription', 'index' ].includes(column.property) &&
              className.push('strong-txt');
          if (configArr) {
            let index = configArr.findIndex(
              (item) => +item.index === columnIndex
            );
            if (index >= 0) {
              className.push('column-w-100');
              configArr[index].type === 'fold' && className.push('fold-box');
              configArr[index].align &&
                  className.push(`text-${ configArr[index].align }`);
            }
            return className.join(' ');
          }
        },
        deviation(value) {
          if (+value > 0) {
            return `提前${ value }天`;
          } else if (+value < 0) {
            return `延后${ Math.abs(value) }天`;
          } else {
            return value;
          }
        }
      }
    };
  },
  computed: {
    ...mapState({
      projectModel: (state) => state.ISDPOld.project.projectModel,
      projectManager: (state) => state.ISDPOld.project.projectManager,
      projectManagerSuperior: (state) =>
        state.ISDPOld.project.projectManagerSuperior,
      detailData: (state) =>
        (state.ISDPOld.project.detailData && state.ISDPOld.project.detailData.data) ||
          {},
      approvalList: (state) => state.ISDPOld.project.approvalList || [],
      userinfo: (state) => state.common.userinfo || {}
    }),
    modelTableConfig() {
      const { projectModel, projectManager, detailData } = this,
        status = detailData.planApprovalStatus;
      let resultConfig =
          projectModel === 'SMALL'
            ? Object.json(smallTableConfig.tableConfig)
            : Object.json(largeTableConfig.tableConfig);
      if (status === 'APPROVING') {
        // 审批中 隐藏 "操作" 一栏
        resultConfig.columns.pop();
        resultConfig.inputConfig = undefined;
      } else if (!projectManager) {
        // 非项目经理  隐藏 "操作" 一栏
        resultConfig.columns.pop();
      } else if (status === 'PASS' && projectModel === 'SMALL') {
        //小项目审批完成 可以填写实际完成时间
        resultConfig.inputConfig.props.push(
          ...[ 'actualEndDate', 'deviationExplain' ]
        );
      }
      // else if(!(projectModel === 'LARGE' && status === 'PASS') || projectModel === 'SMALL'){
      //   let iconsArr = resultConfig.columns[resultConfig.columns.length - 1].icons || [];
      //   iconsArr.shift();
      // }

      return resultConfig;
    },
    customFlag() {
      // if(this.detailData.planTemplateType === 'custom') {
      //   return 1;
      // }
      // return 0;
      return +(this.detailData.planTemplateType === 'custom');
    }
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    dialogCallback(fnName, ...args) {
      this[fnName + 'InDialog'] && this[fnName + 'InDialog'](...args);
    },
    dialogCustomCallback(fnName, ...args) {
      this[fnName + 'Custom'] && this[fnName + 'Custom'](...args);
    },
    async getList() {
      let { data, resultCode } = await this.$store.dispatch(
        'ISDPOld/project/getPlanNodes',
        {
          projectId: this.$route.query.id
        }
      );
      if (resultCode && (+resultCode === 200 || resultCode.includes('200'))) {
        this.handleListData(data || []);
      }
    },
    handleListData(data, bool) {
      const { projectModel, projectManager, detailData, customFlag } = this,
        { planApprovalStatus } = detailData,
        len = projectModel === 'LARGE' ? 13 : 7,
        resultArr = [];

      let secondCount = 0,
        resultData =
            projectModel === 'SMALL' && !bool ? [ { children: data } ] : data;
      this.wbsOldData = resultData;

      resultData.forEach &&
          resultData.forEach((item, firstIndex) => {
            const secondChildren = item.children || [];
            delete item.children;
            if (projectModel === 'LARGE') {
              resultArr.push(
                Object.assign({}, item, {
                  level: 1,
                  firstIndex,
                  index: item.name || '',
                  jobDescription: item.name,
                  icons: customFlag ? [ appendIcons[1], appendIcons[2] ] : [],
                  child: false,
                  _span: {
                    config: [
                      {
                        index: 0,
                        len:
                          (projectManager &&
                            ((planApprovalStatus === 'APPROVING' && len - 2) ||
                              len - 1)) ||
                          len - 2,
                        type: 'merge-row',
                        align: 'left'
                      }
                    ]
                  }
                })
              );
            }
            // 第二级 start
            // 第二级 start
            // 第二级 start
            secondChildren.forEach((secondChildItem, secondIndex) => {
              const thirdChildren = secondChildItem.children || [];
              delete secondChildItem.children;
              secondCount++;
              resultArr.push(
                Object.assign({}, secondChildItem, {
                  level: 2,
                  child: false,
                  index: secondCount,
                  firstIndex,
                  secondIndex,
                  jobDescription: secondChildItem.name,
                  _span: {
                    config: [
                      {
                        index: 1,
                        len:
                          (projectManager &&
                            ((planApprovalStatus !== 'APPROVING' && len - 2) ||
                              len - 2)) ||
                          len - 1,
                        type: 'merge-row',
                        align: 'left'
                      }
                    ]
                  },
                  icons: customFlag
                    ? [ appendIcons[1], appendIcons[2] ]
                    : [ appendIcons[1] ]
                })
              );
              // 第三级 start
              // 第三级 start
              // 第三级 start
              thirdChildren.forEach((thirdChildItem, thirdIdx) => {
                let attributes =
                    thirdChildItem.attributes && thirdChildItem.attributes[0],
                  icons =
                    projectModel === 'LARGE' &&
                    attributes &&
                    attributes.dutyPersonNo &&
                    ((attributes && attributes.approvalStatus === 'PASS') ||
                      thirdChildItem.approvalStatus === 'PASS')
                      ? [ appendIcons[0], appendIcons[2] ]
                      : [ appendIcons[2] ],
                  hasStarIcon =
                    (attributes && +attributes.isMustFill) ||
                    +thirdChildItem.isMustFill
                      ? 'jobDescription'
                      : '';
                resultArr.push(
                  Object.assign({}, thirdChildItem, !bool && attributes, {
                    _id: Date.now(),
                    level: 3,
                    child: true,
                    jobDescription: thirdChildItem.name,
                    secondIndex,
                    firstIndex,
                    thirdIdx,
                    index: secondCount + '.' + (thirdIdx + 1),
                    icons,
                    hasStarIcon,
                    dutyPersonNoCopy: attributes && attributes.dutyPersonNo
                    // id: '',
                    // dutyDept: '',
                    // jobDescription: '',
                    // dutyPersonName: '',
                    // dutyPersonNo: '',
                    // planEndDate: '',
                    // planStartDate: '',
                    // supportPersonName: '',
                    // supportPersonNo: '',
                    // weight: 0,
                    // isMustFill: null
                  })
                );
              });
              // 第三级 end
              // 第三级 end
              // 第三级 end
            });
            // 第二级 end
            // 第二级 end
            // 第二级 end
          });
      this.wbsData = resultArr;
    },
    async importTemplate() {
      const { resultCode, resultMessage } = await this.$store.dispatch(
        'ISDP/project/importTemplate',
        {
          id: this.$route.query.id
        }
      );
      if (+resultCode === 200) {
        this.updateData();
      }
      this.$elMessage({
        type: +resultCode === 200 ? 'success' : 'false',
        message: resultMessage
      });
    },
    async getTeamList() {
      // 团队成员
      let { data } = await this.$store.dispatch('ISDPOld/project/getTeamMember', {
        projectId: this.$route.query.id
      });
      // console.log(data, 'data');
      if (data) {
        let handleArr = (arr = []) => {
            let handleArrResult = [];
            arr.forEach((item) => {
              const staffName = item.staffName || '',
                staffNo = item.staffNo || '',
                deptName = item.deptName || '';
              if (+item.isStop === 1) {
                return false;
              }
              staffName &&
                  staffNo &&
                  handleArrResult.push(
                    Object.assign({}, item, {
                      label: staffName + ' ' + staffNo,
                      value: staffName + '$$' + staffNo + '$$' + deptName
                    })
                  );
            });
            return handleArrResult;
          },
          collectTeamArr = [];

        data.forEach((item) => {
          let arr = item.list ? handleArr(item.list) : [ item ];
          collectTeamArr.push(...arr);
        });
        // console.log(collectTeamArr, 'arr')
        this.remoteData = Object.assign({}, this.remoteData, {
          dutyPersonName: collectTeamArr,
          supportPersonName: collectTeamArr
        });
        this.dialogRemoteData = Object.assign({}, this.dialogRemoteData, {
          receiverName: collectTeamArr
        });
      }
    },
    async exportWBSExcel() {
      const result = await this.$store.dispatch('ISDP/project/exportWBSExcel', {
        projectId: this.$route.query.id
      });
      if (result && result.data) {
        // if (navigator.msSaveOrOpenBlob) { //IE
        //   navigator.msSaveOrOpenBlob(result.data, '项目计划列表.xlsx');
        // } else {
        //   let url = URL.createObjectURL(result.data);
        //   let link = document.createElement('a');
        //   link.href = url;
        //   // link.target = '_blank';
        //   link.download = '项目计划列表.xlsx';
        //   document.body.appendChild(link);
        //   link.click();
        //   URL.revokeObjectURL(url);
        //   document.body.removeChild(link);
        // }
        this.$download(result.data,'项目计划列表.xlsx');
      }
    },
    // model-table callback start
    updateCallback(action, arr, row, column) {
      //,row,column
      const { projectManager } = this,
        { approvalStatus } = row || {};
      if (
        (row && +row.planStatus === 1) ||
          (column &&
            column.property === 'jobDescription' &&
            row &&
            approvalStatus === 'PASS') ||
          !projectManager ||
          (row && +row.level !== 1 && column && column.property === 'index')
      ) {
        row ? (row.inputProp = '') : '';
        return false;
      }
      if (action === 'data') {
        this.wbsData = arr;
      }
    },
    handleChangeForSelected(rowForm, opts, val, tableRow) {
      tableRow.inputProp = '';
      if (opts.prop === 'dutyPersonName') {
        const dutyPersonName = val || rowForm.dutyPersonName,
          dutyPersonNameArr = dutyPersonName && dutyPersonName.split('$$');
        tableRow.dutyPersonName = dutyPersonNameArr[0];
        tableRow.dutyPersonNo = dutyPersonNameArr[1] || '';
        tableRow.dutyDept = dutyPersonNameArr[2] || '';
      } else if (opts.prop === 'supportPersonName') {
        const supportPersonName = val || rowForm.supportPersonName,
          supportPersonNameArr =
              supportPersonName && supportPersonName.split('$$');
        tableRow.supportPersonName = supportPersonNameArr[0];
      }
      this.updateList();
    },
    handleChangeForDatePicker(rowForm, opts, val, tableRow) {
      tableRow.inputProp = '';
      let startDate = tableRow.planStartDate,
        endDate = tableRow.planEndDate,
        finishDate = tableRow.actualEndDate;
      if (tableRow.planStartDate) {
        if (
          [ 'planStartDate', 'planEndDate' ].includes(opts.prop) &&
            startDate > endDate &&
            tableRow.planEndDate
        ) {
          tableRow.planEndDate = '';
          this.$elMessage({
            message: '计划完成时间必须大于计划开始时间!',
            type: 'error'
          });
          return;
        } else if (
          opts.prop === 'actualEndDate' &&
            startDate > finishDate &&
            tableRow.actualEndDate
        ) {
          tableRow.actualEndDate = '';
          this.$elMessage({
            message: '实际完成时间必须大于计划开始时间!',
            type: 'error'
          });
          return;
        }
      }
      this.updateList();
    },
    updateList() {
      this.wbsData = this.wbsData.toJson();
    },
    handleBlur(rowForm, opts, val, tableRow) {
      tableRow ? (tableRow.inputProp = '') : '';
      this.updateList();
    },
    handleChange(rowForm, opts, val, tableRow) {
      if (opts.prop === 'weight') {
        if (Number.isNaN(+val) || +val < 0) {
          tableRow.weight = tableRow.addWeight || tableRow.initWeight || 0;
          this.$elMessage({
            message: '权重只能填写不小于0的数字!',
            type: 'error'
          });
        } else {
          tableRow.addWeight = val;
        }
      } else if (opts.prop === 'jobDescription' || opts.prop === 'index') {
        tableRow.name = val;
        tableRow.jobDescription = val;
      }
      // this.updateList();
    },
    handlelistToData() {
      const resultLTDArr = [],
        { wbsData, projectModel } = this,
        resultData =
            projectModel === 'SMALL' ? [ { level: 1 }, ...wbsData ] : wbsData;
      resultData.forEach((item) => {
        if (item.className === 'hide-row') {
          return false;
        }
        if (+item.level === 1) {
          item.children = [];
          resultLTDArr.push(item);
        } else if (+item.level === 2) {
          item.children = [];
          resultLTDArr[item.firstIndex] &&
              resultLTDArr[item.firstIndex].children.push(item);
        } else {
          delete item.children;
          resultLTDArr[item.firstIndex] &&
              resultLTDArr[item.firstIndex].children[item.secondIndex] &&
              resultLTDArr[item.firstIndex].children[
                item.secondIndex
              ].children.push(item);
        }
      });
      return resultLTDArr;
    },
    remove(data, row) {
      const { level, firstIndex, secondIndex } = row;
      if (+level === 3) {
        let index = data.findIndex((item) => item === row);
        data.splice(index, 1);
      } else {
        // this.wbsData = data.filter((item) => !(+level === 1 && item.firstIndex === firstIndex || +level === 2 && item.firstIndex === firstIndex && item.secondIndex === secondIndex));
        this.wbsData.forEach((item) => {
          if (
            (+level === 1 && item.firstIndex === firstIndex) ||
              (+level === 2 &&
                item.firstIndex === firstIndex &&
                item.secondIndex === secondIndex)
          ) {
            item.className = 'hide-row';
          }
        });
      }
      // this.wbsOldData = this.handlelistToData();

      // const wbsOldData = this.handlelistToData();
      // if(+level === 3){
      //   wbsOldData[firstIndex].children[secondIndex].children.splice(thirdIdx,1);
      // }else if(+level === 2){
      //   wbsOldData[firstIndex].children.splice(secondIndex,1);
      // }else if(+level === 1){
      //   wbsOldData.splice(firstIndex,1);
      // }
      // this.handleListData(wbsOldData,1);
    },
    handleClickForIconAdd(data, row) {
      //第二级新增按钮
      const { secondIndex, firstIndex, level } = row,
        wbsOldData = this.handlelistToData();
      if (+level === 2) {
        wbsOldData[firstIndex].children[secondIndex].children.push(
          appendEle.toJson()
        );
      } else if (+level === 1) {
        wbsOldData[firstIndex].children.push(appendEle.toJson());
      }
      this.handleListData(wbsOldData, 1);
    },
    // 自定义模板
    // 自定义模板
    // 自定义模板
    handleClickForAddModule() {
      // 点击新增模块
      const wbsOldData = this.handlelistToData();
      let firstObj = appendEle.toJson(),
        secondObj = appendEle.toJson();
      firstObj.name = '分类组';
      secondObj.name = '一级任务';
      firstObj.children.push(secondObj);
      wbsOldData.push(firstObj);
      this.handleListData(wbsOldData, 1);
    },
    async selectModule() {
      let customFlag = this.moduleValue === '自定义模板' ? 1 : 0;
      if (customFlag) {
        const { resultCode } = await this.$store.dispatch(
          'ISDP/project/addWBSPlan',
          {
            id: this.$route.query.id,
            planApprovalStatus: '',
            planTemplateType: customFlag ? 'custom' : 'template1',
            planNoteArray: []
          }
        );
        if (+resultCode === 200) {
          this.updateData();
          this.dialogCustomShow = true;
        }
        return false;
      }
      this.importTemplate();
    },
    // 自定义模板
    // 自定义模板
    // 自定义模板
    //  model-table callback end
    async handleClickForSave(approvalStatus = '') {
      const { $route, wbsData, projectModel } = this,
        wbsOldData = this.handlelistToData(wbsData);
        // if(projectModel === 'LARGE'){
        //   const childArr = wbsData.filter((item) => +item.level === 3);
        //   let count = 0;
        //   childArr.forEach((item) => {
        //     count += +item.weight || 0;
        //   });
        //   if(count !== 100){
        //     this.$elMessage({
        //       message: `权重相加必须等于100，目前等于: ${ count }`,
        //       type: 'error'
        //     });
        //     return false;
        //   }
        // }
      let { resultCode } = await this.$store.dispatch(
        'ISDP/project/addWBSPlan',
        {
          id: $route.query.id,
          planNoteArray:
              projectModel === 'SMALL' && wbsOldData[0]
                ? wbsOldData[0].children
                : wbsOldData,
          planApprovalStatus: approvalStatus,
          planTemplateType: this.customFlag ? 'custom' : 'template1' // this.detailData.planTemplateType
        }
      );
      if (resultCode && (+resultCode === 200 || resultCode.includes('200'))) {
        this.updateData();
        this.$emit('getTask');
        this.$elMessage({
          message: '保存成功!',
          type: 'success'
        });
      }
    },
    handleClickForClean() {
      const { id } = this.$route.query;
      this.$elMsgBox({
        title: '提示',
        message: '是否确认清理当前模板,该操作不可恢复!',
        callback: async (action) => {
          if (action === 'confirm') {
            let { resultCode } = await this.$store.dispatch(
              'ISDP/project/cleanPlan',
              {
                id
              }
            );
            if (
              resultCode &&
                (+resultCode === 200 || resultCode.includes('200'))
            ) {
              this.$elMessage({
                message: '操作成功!',
                type: 'success'
              });
              this.updateData();
            } else {
              this.isCleanShow = false;
            }
          }
        }
      });
    },
    // approval start
    // approval start
    // approval start
    async submitApproval() {
      const {
        projectManagerSuperior,
        projectManager,
        wbsData,
        projectModel
      } = this;
      if (!projectManagerSuperior && !projectManager) {
        this.$elMessage({
          message: '没有操作权限!',
          type: 'error'
        });
        return false;
      }
      if (projectManager) {
        //项目经理审批

        if (projectModel === 'LARGE') {
          const childArr = wbsData.filter((item) => +item.level === 3);
          let count = 0;
          childArr.forEach((item) => {
            count += +item.weight || 0;
          });
          if (count !== 100) {
            this.$elMessage({
              message: `权重相加必须等于100，目前等于: ${ count }`,
              type: 'error'
            });
            return false;
          }
        }
        await this.handleClickForSave('APPROVING');
        this.showApproval = false;
        this.getApprovalUrl();
      }
    },
    async updateData() {
      const projectId = this.$route.query.id;
      await this.$store.dispatch('ISDPOld/project/getProjectDetail', {
        id: projectId
      });
      await this.getList();
    },
    changeModel(num) {
      this.showApproval = this.approvalType === num ? !this.showApproval : true;

      this.reason = num === 1 ? '同意' : '拒绝';

      this.approvalType = num;
    },

    // approval end
    // approval end
    // approval end

    // dialog start
    // dialog start
    // dialog start
    beforeCloseCustom() {
      this.dialogCustomShow = false;
    },
    getFormCustom(formName, tem) {
      this.dialogCustomFormTem = tem;
    },
    outsideDialogSubmitCustom() {
      const { dialogCustomFormTem, dialogCustomForm, wbsOldData } = this,
        { first, second } = dialogCustomForm;
        // appendEle
      dialogCustomFormTem.validate(async (valid) => {
        if (valid) {
          let firstArr = 'x'.repeat(+first).split(''),
            secondArr = 'x'.repeat(+second).split(''),
            resultArr = [];
          firstArr.forEach(() => {
            let firstObj = appendEle.toJson(),
              secondObj = appendEle.toJson();
            firstObj.name = '分类组';
            secondObj.name = '一级任务';
            firstObj.children = secondArr.fill(secondObj);
            resultArr.push(firstObj);
          });
          wbsOldData.push(...resultArr);
          this.handleListData(wbsOldData, 1);
          this.beforeCloseCustom();
        }
      });
    },

    // 任务分派
    assignment(data, row) {
      //model-table 分派
      if (!row.dutyPersonNoCopy || row.dutyPersonNoCopy !== row.dutyPersonNo) {
        this.$elMessage({
          message: row.dutyPersonNoCopy
            ? '责任人已修改,请先保存列表数据!'
            : '请选择分项责任人,并保持数据!',
          type: 'error'
        });
        return false;
      }
      this.dialogForm = Object.assign({}, taskDialog.data, {
        planStartDate: row.planStartDate,
        planEndDate: row.planEndDate,
        planNoteId: row.id,
        taskName: row.name || row.jobDescription,
        projectId: this.$route.query.id,
        receiverName: row.dutyPersonName,
        receiverNo: row.dutyPersonNo
      });
      this.dialogShow = true;
    },
    beforeCloseInDialog() {
      this.dialogShow = false;
    },
    getFormInDialog(formName, tem) {
      this.dialogFormTem = tem;
    },
    async outsideDialogSubmitInDialog() {
      const { dialogForm, dialogFormTem } = this,
        // receiverArr = dialogForm.receiverName && dialogForm.receiverName.split('$$'),
        params = Object.assign({}, dialogForm);

      dialogFormTem.validate(async (valid) => {
        if (valid) {
          let { resultCode } = await this.$store.dispatch(
            'ISDP/project/addTask',
            params
          );
          if (
            resultCode &&
              (+resultCode === 200 || resultCode.includes('200'))
          ) {
            this.$emit('getTask');
            this.updateData();
            this.beforeCloseInDialog();
            this.$elMessage({
              message: '操作成功!',
              type: 'success'
            });
          }
        }
      });
    },
    // dialog end
    // dialog end
    // dialog end

    // 审批流
    async getApprovalUrl() {
      // let { data } = await this.$store.dispatch('common/getApproval', {
      //   projectId: this.$route.query.id,
      //   formType: 3
      // });
      // this.approvalUrl = data;
      await this.updateData();
      this.$emit('callback', 'updateApprovalUrl');
    },
    async submit() {
      await this.$store.dispatch('ISDP/project/disclosureFileStart', {
        id: this.$route.query.id
      });
      this.getApprovalUrl();
    }
    // refreshFn(){
    //   // this.getProjectDisclosure();
    //   this.getApprovalUrl();
    //   this.updateData();
    // }
  },
  created() {
    // this.getApprovalUrl();
    this.getList();
    this.getTeamList();
  }
};
</script>
<style lang="less" scoped>
  .webs-plan {
    .add-list {
      margin: 12px 10px;
    }

    .project-wbs-change-group {
      margin: 12px 0 12px 8%;
      .pmc-box {
        .el-form {
          .el-form-item {
            margin-bottom: 10px;
          }
        }
      }
    }
    .txt {
      position: relative;
      z-index: 1;
      line-height: 42px;
      margin-top: 30px;
      font-size: 16px;
      font-weight: 600;
      color: #333;
      display: flex;
    }
    .el-table__expanded-cell {
      padding: 0 !important;
    }
  }
  .el-button {
    padding: 8px 10px;
  }
  .btn-group {
    margin-top: 30px;
  }
</style>
<style lang="less">
  .webs-plan {
    .txt {
      span {
        &:first-child {
          position: relative;
          z-index: 3;
          padding: 0 15px;
          background: #fff;
        }
        &:last-child {
          position: absolute;
          top: 50%;
          width: 100%;
          display: block;
          height: 1px;
          z-index: 2;
          background: #ddd;
        }
      }
    }
  }
</style>
