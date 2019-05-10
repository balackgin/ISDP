<template>
  <div class="webs-plan">
    <div class="txt"><span>{{projectModel === 'SMALL' ? '小项目计划' : 'WBS计划'}}</span><span class="line"></span></div>
    <!-- <div class="mb-1">

    </div> -->
    <div class="mb-1"
         v-if="+detailData.isConfirmProjectModel === 2">
      <el-button v-if="projectManager && detailData.planApprovalStatus === 'NOT_COMMIT'"
                 type="danger"
                 class="add-list"
                 @click="importTemplate">
        <i class="icon far fa-save"></i>
        导入标准模板
      </el-button>
      <!-- <el-button v-if="projectManager && detailData.planApprovalStatus === 'NOT_COMMIT'"
                 type="danger"
                 class="add-list"
                 @click="createPlanNode">
        <i class="icon far fa-save"></i>
        模板自定义
      </el-button> -->
      <el-button type="danger"
                 v-if="projectManager && detailData.planApprovalStatus !== 'APPROVING' && wbsData.length"
                 class="add-list"
                 @click="handleClickForSave">
        <i class="icon far fa-save"></i>
        保存
      </el-button>
      <el-button v-if="projectManager && (!detailData.planApprovalStatus || ['NOT_PASS','NOT_COMMIT','PASS'].includes(detailData.planApprovalStatus)) && wbsData.length"
                 type="danger"
                 @click="changeModel(1)">
        <i class="icon fas fa-plus"></i> {{detailData.planApprovalStatus === 'PASS' ? '提交变更' : '提交审批'}}
      </el-button>
      <template v-if="projectManagerSuperior && detailData.planApprovalStatus === 'APPROVING'">
        <el-button type="danger"
                   @click="changeModel(1)">
          <i class="icon far fa-save"></i> 审批通过
        </el-button>
        <el-button type="danger"
                   @click="changeModel(0)">
          <i class="icon far fa-save"></i> 拒绝
        </el-button>
      </template>
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
    <model-table v-if="wbsData.length"
                 :options="modelTableConfig"
                 :data="wbsData"
                 :fns="tableActions"
                 :remoteData="remoteData"
                 @callback="callback"></model-table>
    <outside-dialog :show="dialogShow"
                    :form="dialogForm"
                    :remoteData="dialogRemoteData"
                    :options="taskDialog"
                    :rules="dialogRules"
                    @callback="dialogCallback"></outside-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import outsideDialog from '@/components/outsideDialog';
import modelTable from '@/components/modelList/modelTable';
// import manageData from '../config/data.manage.json';
// import smallWBSDialog from './config/wbs.small.dialog.json';
// import largeWBSDialog from './config/wbs.large.dialog.json';
import smallTableConfig from './config/wbs.small.config.json';
import largeTableConfig from './config/wbs.large.config.json';
import taskConfig from '../config/task.dialog.json';
// const LARGE_MODEL = {
//   BUSINESS_GROUP: [],
//   PRE_SALE_GROUP: [],
//   DELIVERY_GROUP: [],
//   FINANACE_LEGAL_GROUP: [],
//   PURCHASE_GROUP: [],
//   SUPPORT_GROUP: []
// };

const appendIcons = [ {
  name: 'assignment',
  title: '任务分派',
  text: '分派'
},
{
  name: 'remove',
  title: '删除',
  className: 'text-danger',
  text: '删除'
} ];

const WBSFirstLevel = [ 'BUSINESS_GROUP', 'PRE_SALE_GROUP', 'DELIVERY_GROUP', 'FINANACE_LEGAL_GROUP', 'PURCHASE_GROUP', 'SUPPORT_GROUP' ];
// 商务  售前 交付  财经法务  采购  支撑

const {taskDialog} = taskConfig;
export default {
  components: {
    modelTable,
    outsideDialog
  },
  data() {
    const validateFn = (msg) => (rule,value,callback) => {
      if(value){
        callback();
      }else{
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
      listResultData: {},
      remoteData: {},
      sessionHideRow: [],
      // approval
      // approval
      // approval
      showApproval: false,
      reason: '',
      approvalType: null,
      // approval
      // approval
      // approval

      // dialog start
      // dialog start
      // dialog start
      dialogShow: false,
      dialogRemoteData: {},
      dialogFormTem: null,
      dialogForm: JSON.parse(JSON.stringify(taskDialog.data)),
      taskDialog,  //任务派发
      dialogRules: {
        taskClassify: [ {
          required: true,
          validator: validateFn('请选择重要级别!')
        } ],
        overdue: [ {
          required: true,
          validator: (rule,value,callback) => {
            if(value === ''){
              let msg = '请选择任务状态!';
              this.$elMessage({
                message: msg,
                type: 'error'
              });
              callback(new Error(msg));
            }else{
              callback();
            }
          }
        } ],
        receiverName: [ {
          required: true,
          validator: validateFn('请选择任务接收人!')
        } ],
        feedbackRule: [ {
          required: true,
          validator: validateFn('请选择反馈频率!')
        } ]
      },
      // dialog end
      // dialog end
      // dialog end
      tableActions: {
        rowClassName: (row) => {
          let className = [];
          // row.childrenId && className.push('strong-txt');
          if (row.parentId && this.sessionHideRow && this.sessionHideRow.includes(row.parentId)) {
            className.push('hide-row');
          } else {
            className.push('show-row');
          }
          return className.join(' ');
        },
        cellClassName: (row,column,rowIndex,columnIndex) => {
          let className = [];
          let span = row._span,
            configArr = span &&  span.config;
          (+row.level === 1  || +row.level === 2 ) && [ 'jobDescription','index' ].includes(column.property)  && className.push('strong-txt');
          if(configArr){
            let index = configArr.findIndex((item) => +item.index === columnIndex);
            if(index >= 0){
              className.push('column-w-100');
              configArr[index].type === 'fold' && className.push('fold-box');
              configArr[index].align && className.push(`text-${ configArr[index].align }`)
            }
            return className.join(' ');
          }
        },
        deviation(value){
          if(+value > 0){
            return `提前${ value }天`
          }else if(+value < 0){
            return `延后${ Math.abs(value) }天`
          }else{
            return value;
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      projectModel: (state) => state.ISDPOld.project.projectModel,
      projectManager: (state) => state.ISDPOld.project.projectManager,
      projectManagerSuperior: (state) => state.ISDPOld.project.projectManagerSuperior,
      detailData: (state) => state.ISDPOld.project.detailData && state.ISDPOld.project.detailData.data || {},
      approvalList: (state) => state.ISDPOld.project.approvalList || [],
      userinfo: (state) => state.common.userinfo || {}
    }),
    modelTableConfig(){
      const { projectModel, projectManager,detailData} = this,
        status = detailData.planApprovalStatus;
      let resultConfig = projectModel === 'SMALL' ?  Object.json(smallTableConfig.tableConfig) : Object.json(largeTableConfig.tableConfig);
      if(status === 'APPROVING'){   // 审批中 隐藏 "操作" 一栏
        resultConfig.columns.pop();
        resultConfig.inputConfig = undefined;
      }else if(!projectManager){  // 非项目经理  隐藏 "操作" 一栏
        resultConfig.columns.pop();
      }else if(status === 'PASS' && projectModel === 'SMALL'){  //小项目审批完成 可以填写实际完成时间
        resultConfig.inputConfig.props.push(...[ 'actualEndDate','deviationExplain' ]);
      }
      // else if(!(projectModel === 'LARGE' && status === 'PASS') || projectModel === 'SMALL'){
      //   let iconsArr = resultConfig.columns[resultConfig.columns.length - 1].icons || [];
      //   iconsArr.shift();
      // }

      return resultConfig;
    }
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    dialogCallback(fnName,...args){
      this[fnName + 'InDialog'] && this[fnName + 'InDialog'](...args);
    },
    createPlanNode() {

    },
    async getList(){
      let {data} = await this.$store.dispatch('ISDPOld/project/getPlanNodes',{
        projectId: this.$route.query.id
      });
      if(data && data.length){
        this.handleListData(data);
      }
    },

    handleListData(data,isResult){
      let collectObj = {},
        {projectModel,projectManager,detailData} = this,
        { planApprovalStatus } = detailData,
        len = projectModel === 'LARGE' ? 13 : 7;
        // let secondCount = 0;

      if(!isResult){
        data.forEach((item)=>{
          const firstItem = item.attributes && item.attributes[0] || {},
            {projectModule_en,projectModule} = firstItem;


          if(!collectObj[projectModule_en]){  // 判断有没有第一级 没有新增
            const firstObj = Object.assign({},firstItem,{
              children: [],
              index: projectModule,
              level: 1,
              prohibit: true,
              _span: {
                config: [ {
                  index: 0,
                  len: projectManager && (detailData.planApprovalStatus === 'APPROVING' && len - 1 ||   len)  || len - 1,
                  type: 'merge-row',
                  align: 'left'
                } ]
              }
            });

            collectObj[projectModule_en] = firstObj;  // 第一级
          }
          const collectProject = collectObj[projectModule_en];
          let bool = collectProject.children.some((val) => val.name === item.name);
          !bool && collectProject.children.push(item);

        });
      }else{
        collectObj = data;
      }
      this.listResultData = collectObj.toJson();


      let result = [];
      const collectData =  projectModel === 'SMALL' ? Object.keys(collectObj) : WBSFirstLevel;
      let secondCount = 0;
      collectData.forEach((item) => {
        const currentObj = collectObj[item];
        if(currentObj){
          // 第二级 start
          // 第二级 start
          // 第二级 start
          currentObj.projectModule &&  result.push(currentObj);
          currentObj.children && currentObj.children.forEach((secondItem) => {
            secondCount++;
            const thirdChildren = secondItem.children;
            // index = projectModel === 'SMALL' ? $numUppercase(secondCount) : $numUppercase(secondIndex+1)

            delete secondItem.children;
            const secondObj = Object.assign({},secondItem,secondItem.attributes[0],{
              jobDescription: secondItem.name,
              level: 2,
              prohibit: true,
              index: secondCount,
              _span: {
                config: [ {
                  index: 1,
                  len: projectManager && (planApprovalStatus !== 'APPROVING' &&  len - 2  || len - 2)   || len - 1,
                  type: 'merge-row',
                  align: 'left'
                } ]
              },
              icons: [ {
                text: '新增',
                name: 'handleClickForIconAdd'
              } ]
            })
            result.push(secondObj);
            // 第三级 start
            // 第三级 start
            // 第三级 start
            thirdChildren && thirdChildren.forEach((thirdItem,thirdIndex) => {
              let attributes = thirdItem.attributes && thirdItem.attributes[0] || {},
                {approvalStatus,planStatus} = attributes,
                resultIcons = [ appendIcons[1] ];
              if(approvalStatus === 'APPROVING' || approvalStatus === 'PASS' && +planStatus === 2){
                resultIcons = {icons: []};
              }else if(approvalStatus === 'PASS' && projectModel === 'LARGE'){
                resultIcons = {icons: appendIcons};
              }else{
                resultIcons = {icons: [ appendIcons[1] ]};
              }
              const thirdObj = Object.assign({},thirdItem,attributes,{
                parentNoteId: secondItem.id,
                jobDescription: thirdItem.name,
                initWeight: thirdItem.weight,
                level: 3,
                index: secondCount + '.' + (thirdIndex + 1),
                hasStarIcon: attributes.isMustFill && [ 'jobDescription' ],
                attributes
              },
              resultIcons
              );
              result.push(thirdObj);
            });
          })
        }
      });

      //  第二种方法
      //  第二种方法
      //  第二种方法 end
      this.wbsData = result;
    },
    //  团队成员
    async importTemplate() {
      const { resultCode, resultMessage } = await this.$store.dispatch('ISDP/project/importTemplate', {
        id: this.$route.query.id
      })
      if(+resultCode === 200) {
        this.updateData();
      }
      this.$elMessage({
        type: +resultCode === 200 ? 'success' : 'false',
        message: resultMessage
      })
    },
    async getTeamList(){
      let {data} = await this.$store.dispatch('ISDPOld/project/getTeamMember',{
        projectId: this.$route.query.id
      });
      if(data){
        let handleArr = (arr = []) => {
            let handleArrResult = [];
            arr.forEach((item) => {
              const staffName = item.staffName || '',
                staffNo = item.staffNo || '',
                deptName = item.deptName || '';
              if(+item.isStop === 1){return false}
              staffName && staffNo && handleArrResult.push(Object.assign({},item,{
                label: staffName + ' ' + staffNo,
                value: staffName + '$$' + staffNo + '$$' + deptName
              }));
            })
            return handleArrResult;
          },
          collectTeamArr =  [];

        data.forEach((item) => {
          let arr = item.list ? handleArr(item.list) : [ item ];
          collectTeamArr.push(...arr);
        });
        this.remoteData = Object.assign({},this.remoteData,{
          dutyPersonName: collectTeamArr,
          supportPersonName: collectTeamArr
        });
        this.dialogRemoteData = Object.assign({},this.dialogRemoteData,{
          receiverName: collectTeamArr
        });
      }
    },

    // model-table callback start
    updateCallback(action,arr,row,column){  //,row,column
      const {projectManager} = this,
        { approvalStatus } = row || {};

      if(row && +row.planStatus === 2 || column && column.property ===  'jobDescription' && row && approvalStatus === 'PASS' || !projectManager){
        row ? row.inputProp = '' : '';
        return false;
      }
      if(action === 'data'){
        this.wbsData = arr;
      }
    },
    handleChangeForSelected(rowForm,opts,val,tableRow){
      tableRow ? tableRow.inputProp = '' : '';
      if(opts.prop === 'dutyPersonName'){
        const dutyPersonName = val || rowForm.dutyPersonName,
          dutyPersonNameArr = dutyPersonName && dutyPersonName.split('$$');
        tableRow.dutyPersonName = dutyPersonNameArr[0];
        tableRow.dutyPersonNo = dutyPersonNameArr[1] || '';
        tableRow.dutyDept = dutyPersonNameArr[2] || '';
        return false;
      }else if(opts.prop === 'supportPersonName'){
        const supportPersonName = val || rowForm.supportPersonName,
          supportPersonNameArr = supportPersonName && supportPersonName.split('$$');
        tableRow.supportPersonName = supportPersonNameArr[0];
        // tableRow.supportPersonNo = supportPersonNameArr[1];
        // tableRow.supportPersonDutyDept = supportPersonNameArr[2];
      }
      this.updateList();
    },
    handleChangeForDatePicker(rowForm,opts,val,tableRow){
      tableRow ? tableRow.inputProp = '' : '';
      let startDate = new Date(tableRow.planStartDate).getTime(),
        endDate = new Date(tableRow.planEndDate).getTime(),
        finishDate = new Date(tableRow.actualEndDate).getTime();
      if(tableRow.planStartDate){
        if([ 'planStartDate','planEndDate' ].includes(opts.prop) && startDate > endDate && tableRow.planEndDate){
          tableRow.planEndDate = '';
          this.$elMessage({
            message: '计划完成时间必须大于计划开始时间!',
            type: 'error'
          });
        }else if(opts.prop === 'actualEndDate' && startDate > finishDate && tableRow.actualEndDate){
          tableRow.actualEndDate = '';
          this.$elMessage({
            message: '实际完成时间必须大于计划开始时间!',
            type: 'error'
          });
        }
      }
      this.updateList();
    },
    updateList(){
      this.wbsData = JSON.parse(JSON.stringify(this.wbsData));
    },
    handleBlur(rowForm,opts,val,tableRow){
      tableRow ? tableRow.inputProp = '' : '';
      this.updateList();
    },
    handleChange(rowForm,opts,val,tableRow){
      if(opts.prop === 'weight'){
        if(Number.isNaN(+val) || +val < 0){
          tableRow.weight = tableRow.addWeight || tableRow.initWeight || 0;
          this.$elMessage({
            message: '权重只能填写不小于0的数字!',
            type: 'error'
          });
        }else{
          tableRow.addWeight = val;
        }
      }
    },
    remove(data,row){
      let index = data.findIndex((item) => item === row);
      if(index >= 0){
        this.wbsData.splice(index,1);
      }
    },
    handleClickForIconAdd(data,row){
      const { listResultData } = this,
        {projectModule_en} = row;
      if(projectModule_en && listResultData[projectModule_en]){
        let resultChildArr = listResultData[projectModule_en].children || [],
          index = resultChildArr.findIndex((item) => item.id === row.id);
        resultChildArr[index].children.push({
          jobDescription: '',
          dutyPersonName: '',
          supportPersonName: '',
          planStartDate: '',
          planEndDate: '',
          weight: 0
        });
        this.handleListData(listResultData,true);
      }
    },
    //  model-table callback end
    async handleClickForSave(){
      const {$route,wbsData} = this;
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


      let {resultCode} = await this.$store.dispatch('ISDP/project/modifyWBSPlanNode',{
        id: $route.query.id,
        planNoteArray: wbsData
      });
      if(+resultCode === 200 || resultCode.includes('200')){
        this.getList();
        this.$emit('getTask');
        this.$elMessage({
          message: '保存成功!',
          type: 'success'
        });
      }
    },
    // approval start
    // approval start
    // approval start
    async submitApproval(){
      const {approvalList,userinfo,reason,approvalType,$route,projectManagerSuperior,projectManager,wbsData,projectModel } = this,
        projectId = $route.query.id;
      if(!projectManagerSuperior && !projectManager){
        this.$elMessage({
          message: '没有操作权限!',
          type: 'error'
        });
        return false;
      }else if(approvalType === 0 && !reason){
        this.$elMessage({
          message: '请填写原因!',
          type: 'error'
        });
        return false;
      }
      if(projectManagerSuperior){  //项目经理上级审批
        const params = Object.assign({},approvalList[0],{
          applicantNo: userinfo.username,
          result: approvalType,
          idea: reason,
          formType: 3,
          projectId
        });
        let {resultCode} =  await this.$store.dispatch('ISDP/project/projectApproval',params);
        if(!(+resultCode === 200 || resultCode && resultCode.includes('200'))){
          this.$emit('getTask');
          return;
        }
      }else if(projectManager){  //项目经理审批
        // let resultData = wbsData.filter((item) => item.level === 3);
        // if(!this.sureDialog) {
        //   return false;
        // }
        if(projectModel === 'LARGE'){
          const childArr = wbsData.filter((item) => +item.level === 3);
          let count = 0;
          childArr.forEach((item) => {
            count += +item.weight || 0;
          });
          if(count !== 100){
            this.$elMessage({
              message: `权重相加必须等于100，目前等于: ${ count }`,
              type: 'error'
            });
            return false;
          }
        }
        const params = Object.assign({},{
          id: projectId,
          planNoteArray: wbsData,
          approvalForm: {
            approvalReason: reason
          }
        });
        let {resultCode} = await this.$store.dispatch('ISDP/project/wbsApproval',params);
        if(!(+resultCode === 200 || resultCode && resultCode.includes('200'))){
          this.$emit('getTask');
          return;
        }
      }
      this.$elMessage({
        message: '操作成功!',
        type: 'success'
      });
      this.showApproval = false;
      this.updateData();
    },
    updateData(){
      const projectId = this.$route.query.id;
      this.$store.dispatch('ISDPOld/project/getProjectDetail',{
        id: projectId
      });
      this.getList();
      this.$store.dispatch('ISDPOld/project/getApprovalList',{
        projectId,
        formType: 3
      });
    },
    changeModel(num){

      this.showApproval = this.approvalType === num ? !this.showApproval : true;

      this.reason = num === 1 ?  '同意' : '拒绝';

      this.approvalType = num;
    },

    // approval end
    // approval end
    // approval end

    // dialog start
    // dialog start
    // dialog start
    assignment(data,row){  //model-table 分派
      this.dialogForm = Object.assign({},taskDialog.data,{
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
    beforeCloseInDialog(){
      this.dialogShow = false;
    },
    getFormInDialog(formName,tem){
      this.dialogFormTem = tem;
    },
    async outsideDialogSubmitInDialog(){
      const  {dialogForm,dialogFormTem} = this,
        // receiverArr = dialogForm.receiverName && dialogForm.receiverName.split('$$'),
        params = Object.assign({},dialogForm);

      dialogFormTem.validate(async (valid) => {
        if(valid){
          let {resultCode } = await this.$store.dispatch('ISDP/project/addTask',params);
          if(+resultCode === 200 || resultCode && resultCode.includes('200')){
            this.$emit('getTask');
            this.updateData();
            this.beforeCloseInDialog();
            this.$elMessage({
              message: '操作成功!',
              type: 'success'
            })
          }
        }
      })


    }
    // dialog end
    // dialog end
    // dialog end
  },
  created () {
    this.getList();
    this.getTeamList();
  }
}
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
