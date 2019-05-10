<template>
  <div class="webs-plan">
    <div class="txt"><span>{{projectModel === 'SMALL' ? '小项目计划' : 'WBS计划'}}</span><span class="line"></span></div>
    <el-button type="danger"
               v-if="projectManager"
               class="add-list"
               @click="handleClickForPlus(projectModel === 'SMALL' ? 'WBS_SMALL' : 'WBS_LARGE', 'addWBS')">
      <i class="icon fas fa-plus"></i>
      添加
    </el-button>
    <el-button v-if="projectManager && (!detailData.planApprovalStatus || detailData.planApprovalStatus === 'NOT_COMMIT')
               || projectManager && detailData.planApprovalStatus === 'NOT_PASS'"
               type="danger"
               @click.native.prevent="changeModel(1)">
      <i class="icon far fa-save"></i>提交审批
    </el-button>
    <el-button v-if="projectManagerSuperior && detailData.planApprovalStatus === 'APPROVING'"
               type="danger"
               @click.native.prevent="changeModel(1)">
      <i class="icon far fa-save"></i> 审批通过
    </el-button>
    <el-button v-if="projectManagerSuperior && detailData.planApprovalStatus === 'APPROVING'"
               type="danger"
               @click.native.prevent="changeModel(0)">
      <i class="icon far fa-save"></i>拒绝
    </el-button>
    <section class="project-wbs-change-group"
             v-if="showWBS">
      <div class="pmc-box">
        <el-row>
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
        </el-row>
        <el-button type="danger"
                   size="small"
                   class="pmc-btn"
                   @click="submitApproval">提交</el-button>
      </div>
    </section>

    <model-table :options="modelTableConfig"
                 :fns="fns"
                 :data="websData"
                 @callback="callback"></model-table>
    <outside-dialog :show="outsideDialogShow"
                    :form="dialogForm"
                    :remoteData="remoteData"
                    :options="dialogOptions"
                    @callback="callback"></outside-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import outsideDialog from '@/components/outsideDialog';
import modelTable from '@/components/modelList/modelTable';
import manageData from '../config/data.manage.json';
import smallWBSDialog from './config/wbs.small.dialog.json';
import largeWBSDialog from './config/wbs.large.dialog.json';
import smallTableConfig from './config/wbs.small.config.json';
import largeTableConfig from './config/wbs.large.config.json';
import taskDialog from '../config/task.dialog.json';

export default {
  components: {
    modelTable,
    outsideDialog
  },
  data() {
    return {
      dutyPersonName: [], // 分项责任人
      manageData,
      dialogConfig: {
        ...smallWBSDialog, // 小项目计划弹窗
        ...largeWBSDialog, // 大项目计划弹窗
        ...taskDialog // 任务分派弹窗
      },
      smallGroup: [], // 子任务选择框
      websData: [],
      outsideDialogShow: false,
      dialogForm: {},
      dialogOptions: {},
      sessionRow: [],
      remoteData: {},
      eidtRow: {},
      showWBS: false,
      hasModel: true, // 小计划子任务选择框是否删除projectModel
      MAP_LIST: [ 'BUSINESS_GROUP', 'PRE_SALE_GROUP', 'DELIVERY_GROUP', 'FINANACE_LEGAL_GROUP', 'PURCHASE_GROUP', 'SUPPORT_GROUP' ], // wbs计划排版
      cascader: { // 大项目计划模板
        BUSINESS_GROUP: {},
        PRE_SALE_GROUP: {},
        DELIVERY_GROUP: {},
        FINANACE_LEGAL_GROUP: {},
        PURCHASE_GROUP: {},
        SUPPORT_GROUP: {}
      },
      reason: '', // 提交申请理由
      refuse: 1, // 0 拒绝通过 1 同意通过
      taskGroup: {}, // 子任务分组选择
      fns: {
        rowClassName: (row) => {
          let className = [];
          // row.childrenId && className.push('strong-txt');
          if (row.parentId && this.sessionRow.includes(row.parentId)) {
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
          (+row.level === 1 && column.property === 'index' || +row.level === 2 && column.property === 'taskName') && className.push('strong-txt');
          if(configArr){
            let index = configArr.findIndex((item) => +item.index === columnIndex);
            if(index >= 0){
              className.push('column-w-100');
              configArr[index].type === 'fold' && className.push('fold-box');
              configArr[index].align && className.push(`text-${ configArr[index].align }`)
            }
            return className.join(' ');
          }
        }
      }
    }
  },
  computed: {
    ...mapState({
      projectModel(state) {
        const { detailData } = state.ISDPOld.project || {};
        const { projectModel } = detailData && detailData.data || {}
        return projectModel;
      },
      projectManager: (state) => state.ISDPOld.project.projectManager,
      modelTableConfig() {
        const projectModel = this.projectModel,
          projectManager = this.projectManager;
        let resultObj = projectModel === 'SMALL' ? smallTableConfig.tableConfig : largeTableConfig.tableConfig;
        resultObj = JSON.parse(JSON.stringify(resultObj));
        !projectManager &&  resultObj.columns[resultObj.columns.length - 1].label === '操作' && resultObj.columns.pop();

        if(this.detailData.planApprovalStatus === 'PASS'){
          resultObj.columns[resultObj.columns.length - 1].icons && resultObj.columns[resultObj.columns.length - 1].icons.pop();
        }
        return resultObj;
      },
      detailData: (state) => {
        let detail = state.ISDPOld.project.detailData || {};
        return detail.data || {};
      },
      projectManagerSuperior: (state) => state.ISDPOld.project.projectManagerSuperior || '',
      approvalList: (state) =>state.ISDPOld.project.approvalList || [],
      dialogConfigForStatus(state) {
        let { planApprovalStatus: status } = state.ISDPOld.project.detailData.data || 'NOT_COMMIT';
        if(status === 'NOT_COMMIT') {
          this.dialogConfig['WBS_SMALL'].group[0].formConfig[4].disabled = true;
        } else {
          this.dialogConfig['WBS_SMALL'].group[0].formConfig[4].disabled = false;
        }
        return this.dialogConfig;
      }
    })
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    updateCallback(key,data = {}, row = {}){
      // console.log(row, 'row');
      const obj = key === 'data' && row || key === 'form' && data || {};
      if(obj.childrenId){
        obj.inputProp = '';
        return false;
      }
      if(row.childrenId) {
        return;
      }
      if(key === 'data'){
        this.websData = JSON.parse(JSON.stringify(data));
      }
    },
    beforeClose() {
      this.outsideDialogShow = false;
    },
    remove(data, rowData, ddd, iconOpts) {
      // console.log(rowData, 'rowdata');
      // this.deleteWBSPlanNode([ {id: rowData.id} ]);
      const { icon: iconName } = iconOpts;
      if (iconName) {
        this.action = iconName;
      }
    },
    handleChangeForSelected(data, opts) {
      if(opts.prop === 'projectModule'){   // 模块
        const selectGroup = this.taskGroup[data.projectModule];
        this.dialogForm = Object.assign({},this.dialogForm,{
          parentNoteId: ''
        });
        if(this.projectModel === 'LARGE') {
          this.remoteData = Object.assign({}, this.remoteData, {
            parentNoteId: selectGroup || []
          });
        }
      } else if(opts.prop === 'dutyPersonName'){
        let val = data[opts.prop] || '';
        val = val.split('$$');
        this.dialogForm = Object.assign({},this.dialogForm,{
          dutyDept: val[2] || ''
        });
      }
    },
    changeModel(num) {
      this.refuse  = num;
      this.showWBS = !this.showWBS;
    },
    handleChangeForDatePicker(data,opts){
      const { prop } = opts;
      if([ 'planStartDate','planEndDate' ].includes(prop) && data['planStartDate'] && data['planEndDate']){
        let startDate = new Date(data['planStartDate']).getTime(),
          endDate = new Date(data['planEndDate']).getTime();
        if(startDate > endDate){
          this.$elMessage({
            message: '预计完成时间必须大于计划开始时间!',
            type: 'error'
          });
          data.planEndDate = '';
          return false;
        }
      }
    },
    // 获取detail
    getDetail(){
      this.$store.dispatch('ISDPOld/project/getProjectDetail',{
        id: this.$route.query.id
      });
    },
    // 提交审批
    async handleClickForModelChange(){
      const { id, version, serialNo,status } = this.approvalList && this.approvalList[0] || {};
      let {resultCode, resultMessage} = await this.$store.dispatch('ISDP/project/projectApproval', {
        result: this.refuse,
        projectId: this.$route.query.id,
        applicantNo: this.detailData.projectManagerNo,
        idea: this.reason,
        id,
        version,
        serialNo,
        status,
        formType: 3
      });
      if(+resultCode === 200) {
        this.showWBS = false;
        this.getApprovalList(3);
        this.getDetail();
        this.$elMessage({
          type: +resultCode === 200 ? 'success' : 'error',
          message: resultMessage
        })
      }
    },
    async submitApproval() {
      if(this.projectManagerSuperior) {
        this.handleClickForModelChange();
        return;
      }
      let arr = [];
      this.websData &&
        this.websData.forEach((item) => {
          if(!item.childrenId) {
            arr.push({
              ...item,
              parentNoteId: item.pid,
              dutyDept: item.dutyDept || '',
              jobDescription: item.taskName
            })
          }
        })
      const {resultCode, resultMessage } = await this.$store.dispatch('ISDP/project/wbsApproval', {
        id: this.$route.query.id,
        planNoteArray: arr,
        approvalForm: {
          approvalReason: this.reason
        }
      })
      if(+resultCode === 200) {
        this.showWBS = false;
        this.getPlanNodes();
        this.getDetail();
        this.$elMessage({
          type: 'success',
          message: resultMessage
        });
        const { id } = this.$route.query;
        if(!id){
          return false;
        }
        await this.$store.dispatch('ISDPOld/project/getApprovalList',{projectId: id, formType: 3});
      }
    },
    handleClickForPlus(name, action) {  // 触发弹窗回调
      let obj = this.dialogConfigForStatus[name];
      if (action) this.action = action;
      if (this.action === 'editWBS') { // 编辑WBS计划
        const { parentId, pid } = this.eidtRow;
        const len = parentId.match(/\d/g).length;
        const moduleName = parentId.slice(0, -len);
        const { dutyPersonName = '', dutyPersonNo = '',supportPersonName = '',supportPersonNo = '',dutyDept = ''} = this.eidtRow;

        if(this.projectModel === 'LARGE') {
          this.remoteData = Object.assign({}, this.remoteData, {
            parentNoteId: this.taskGroup[moduleName]
          });
        }
        this.eidtRow = {
          ...this.eidtRow,
          projectModule: moduleName,
          parentNoteId: pid,
          dutyPersonName: (dutyPersonName || '') + (dutyPersonName && dutyPersonNo && ' ' || '') + (dutyPersonNo || ''),
          supportPersonName: (supportPersonName || '') + (supportPersonName && supportPersonNo && ' ' || '') + (supportPersonNo || ''),
          dutyDept: dutyDept === 'null' && '' || dutyDept || ''
        }
        obj.title = this.projectModel === 'SMALL' ? '小项目计划修改' : 'WBS计划修改';
      } else if(this.action == 'taskAssignment') { // 分派任务
        const { dutyPersonName = '', dutyPersonNo = '', planStartDate = '', planEndDate = '' } = this.eidtRow;
        obj.data.taskReciver = (dutyPersonName || '') + (dutyPersonName && dutyPersonNo && ' ' || '') + (dutyPersonNo || '');
        obj.data.dutyPersonNo = dutyPersonNo;
        obj.data.overdue = false;
        if(!dutyPersonName && !planStartDate && !planEndDate) {
          this.$elMessage({
            message: '分派任务时至少填写责任人、计划开始时间、计划结束时间！',
            type: 'error'
          })
          return false;
        }
        obj.title = '任务分派';
      } else if(this.action === 'addWBS') {
        this.eidtRow = {};
        obj.data = {
          progress: '0'
        };
        obj.title =  this.projectModel === 'SMALL' ? '添加小项目计划' : '添加WBS计划';
      }
      obj.data = Object.assign({},
        {
          ...obj.data,
          ...this.eidtRow,
          _name: `dialog-${ this.action }`
        }
      );

      if (obj) {
        if(obj.name === 'dialog-editWBS'){
          let formOptsArr = obj.group[0].formConfig;
          obj.group[0].formConfig = formOptsArr.map((item) => {
            if(this.detailData.planApprovalStatus === 'PASS'){
              if([ 'planStartDate','planEndDate' ].includes(item.prop)){
                item.required = false;
                item.disabled = true;
              }
              [ 'actualEndDate' ].includes(item.prop) ? item.disabled = false  : '';
            }
            return item;
          });
        }
        this.dialogOptions = obj;
        // const { formConfig } = obj.group[0];
        this.dialogForm = Object.assign({}, obj.data);
        this.outsideDialogShow = true;
      }
    },
    async addTask(params) { // 任务分派
      const { resultCode, resultMessage } = await this.$store.dispatch('ISDP/project/addTask', params);
      if(resultCode === 'TS200') {
        this.getPlanNodes();
        this.$emit('getTask');
        this.$elMessage({
          type: 'success',
          message: resultMessage
        })
      }
      this.outsideDialogShow = false;
    },
    async modifyWBSPlanNode(args) { // 计划编辑
      const { resultCode, resultMessage } = await this.$store.dispatch('ISDP/project/modifyWBSPlanNode', {
        id: this.$route.query.id,
        planNoteArray: args
      });
      this.outsideDialogShow = false;
      this.$elMessage({
        type: +resultCode === 200 ? 'success' : 'error',
        message: resultMessage
      })
      this.getPlanNodes();
    },
    async addWBSPlanNode(args) { // 计划添加
      const { resultCode, resultMessage } = await this.$store.dispatch('ISDP/project/addWBSPlanNode', {
        id: this.$route.query.id,
        planNoteArray: args
      });
      this.outsideDialogShow = false;
      this.$elMessage({
        type: +resultCode === 200 ? 'success' : 'error',
        message: resultMessage
      })
      this.getPlanNodes();

    },
    taskAssignment(data, rowData, opts, iconOpts) { // 任务分派
      const { name: iconName } = iconOpts;
      if (iconName) {
        let index = data.findIndex(
          (item) =>
            (item.id && item.id === rowData.id) ||
            (item._index && item._index === rowData._index)
        );
        this.eidtRow = data[index];
        this.action = iconName;
        this.handleClickForPlus('taskDialog');
      }
    },
    editWBS(data, rowData, ddd, iconOpts) { // 计划编辑
      const { name: iconName } = iconOpts;
      if (iconName) {
        let index = data.findIndex(
          (item) =>
            (item.id && item.id === rowData.id) ||
            (item._index && item._index === rowData._index)
        );
        this.eidtRow = data[index];
        this.action = iconName;
        if(this.projectModel === 'SMALL') {
          this.handleClickForPlus('WBS_SMALL');
          return ;
        }
        this.handleClickForPlus('WBS_LARGE');
      }
    },
    outsideDialogSubmit() { // 提交
      const { dialogForm } = this,
        args = JSON.parse(JSON.stringify(dialogForm)),
        { id, projectModule, parentNoteId, taskName, planStartDate, planEndDate, actualEndDate, deviationDay, dutyPersonName, supportPersonName } = args;

      let dutyPersonNameArr = [],
        supportPersonNameArr = [],
        msg = '';

      if(dutyPersonName && dutyPersonName.indexOf('$') !== -1) {
        dutyPersonNameArr =  dutyPersonName && dutyPersonName.split('$$') || []
      } else {
        dutyPersonNameArr = dutyPersonName && dutyPersonName.split(' ') || [];
      }
      if(supportPersonName && supportPersonName.indexOf('-') !== -1) {
        supportPersonNameArr =  supportPersonName && supportPersonName.split('-') || []
      } else {
        supportPersonNameArr = supportPersonName && supportPersonName.split(' ') || [];
      }
      const wbs_params = {
        id: args.id,
        projectModule,
        parentNoteId,
        planStartDate,
        planEndDate,
        actualEndDate,
        deviationDay,
        progress: args.progress,
        dutyPersonNo: dutyPersonNameArr[1],
        dutyPersonName: dutyPersonNameArr[0],
        dutyDept: dialogForm.dutyDept || '',
        deviationExplain: args.deviationExplain,
        jobDescription: taskName,
        supportPersonName: supportPersonNameArr[0],
        supportPersonNo: supportPersonNameArr[1]
      }

      if (args._name === 'dialog-editWBS') {
        msg = this.regexpDialog(args);
        if(!msg) {
          let index = this.websData.findIndex((item) => item.id === id);
          this.websData = this.websData.map((item, i)=> {
            if(index === i) item = args;
            return item;
          })
          this.modifyWBSPlanNode([ wbs_params ]);
        }
      } else if(args._name === 'dialog-addWBS') {
        msg = this.regexpDialog(args);
        if(!msg) this.addWBSPlanNode([ wbs_params ]);
      } else if(args._name === 'dialog-taskAssignment') {
        const params = {
          projectId: this.$route.query.id,
          receiverName: dialogForm.dutyPersonName,
          receiverNo: dialogForm.dutyPersonNo,
          overdue: dialogForm.overdue,
          taskName: dialogForm.taskName,
          taskContent: dialogForm.taskQuest,
          planStartDate: dialogForm.planStartDate,
          planEndDate: dialogForm.planEndDate,
          feedbackRule: dialogForm.daysFeedback,
          planNoteId: dialogForm.id,
          taskClassify: dialogForm.taskLevel
        }
        if(!msg) this.addTask(params);
      }
      if (msg) {
        this.$elMessage({
          message: msg,
          type: 'error'
        });
        return false;
      }
    },

    regexpDialog(args) { // 计划编辑校验
      if(this.projectModule === 'LARGE' && !args.projectModel) {
        return '请选择模块';
      }
      const status = this.detailData.planApprovalStatus;
      switch(true) {
      case !args.parentNoteId:
        return '请选择子任务';
      case !args.taskName:
        return '请输入任务名称';
      case status !== 'PASS' && !args.planStartDate:
        return '请选择计划开始时间';
      case status !== 'PASS' && !args.planEndDate:
        return '请选择计划结束时间';
      default:
        return false;
      }
    },
    regexForAddTask(args) { // 任务分派校验
      switch(true) {
      case !args.taskLevel:
        return '请选择任务级别';
      case args.overdue === '':
        return '请选择任务状态';
      case !args.taskReciver:
        return '请选择任务接收人';
      case !args.daysFeedback:
        return '请选择任务反馈频率';
      default:
        return ''
      }
    },
    SMALLWBSTemplate(data) {
      // const map_list = [ '一', '二', '三', '四', '五', '六', '七', '八', '九', '十' ];
      this.websData = [];
      this.smallGroup = [];
      data && data.forEach((item, _index) => {
        const { name, id, children } = item;
        this.websData.push({
          id,
          index: this.$numUppercase(_index + 1),
          taskName: name,
          childrenId: id,
          level: 2,
          icons: [],
          _span: {
            config: [ {
              index: 1,
              len: 6,
              type: 'merge-row',
              align: 'left'
            } ]
          }
        })
        this.smallGroup.push({
          label: name,
          value: id
        })
        children.forEach((item, index) => {
          const { attributes = [], pid } = item;
          // let icons = [];
          let { isMustFill, milestoneApprovalStatus } = attributes[0] || {};
          let obj = this.statusCheck(isMustFill, milestoneApprovalStatus);
          this.websData.push({
            id: item.id,
            index: index + 1,
            taskName: item.name,
            ...attributes[0],
            parentId: id,
            pid,
            level: 3,
            ...obj
          })
        })
      })
      this.remoteData = Object.assign({}, this.remoteData, {
        parentNoteId: this.smallGroup
      });
    },
    statusCheck(isMustFill, status) {
      let icons = [],
        _span = {};
      if(isMustFill) {
        _span = {
          type: 'fold',
          foldProp: [ 'taskName' ],
          config: [ {
            index: 1,
            len: 1,
            align: 'left'
          } ]
        };
      }
      if(!status || (status === 'NOT_COMMIT' && isMustFill !== 1)) {
        icons.push({
          name: 'remove',
          title: '删除',
          className: 'text-danger',
          text: '删除'
        })
      } else if(status === 'PASS' && this.projectModel === 'LARGE') {
        icons.push({
          name: 'taskAssignment',
          title: '分派',
          className: 'text-danger',
          text: '分派'
        } )
      }
      return { icons, _span };
    },
    BIGWBSTemplate(data) {
      this.cascader = {};
      this.taskGroup = {};
      this.websData = [];
      data && data.forEach((item, index) => {
        const { name, children = [], attributes, id } = item;
        const { projectModule, projectModule_en, weight } = attributes[0];
        if(!this.taskGroup[projectModule_en]) {
          this.taskGroup[projectModule_en] = []
        }
        this.taskGroup[projectModule_en].push({
          value: id,
          label: name
        })

        // 添加首个模块表格数据
        if(!this.cascader[projectModule_en]) {
          this.cascader[projectModule_en] = [ {
            index: projectModule,
            childrenId: projectModule_en + index,
            level: 1,
            id: projectModule_en,
            parentId: '',
            _len: 'all',
            icons: [],
            _span: {
              config: [
                {
                  index: 0,
                  len: this.projectManager ? 11 : 10,
                  type: 'merge-row',
                  align: 'left'
                }
              ]
            }
          } ]
        }
        this.cascader[projectModule_en].push({
          // index: map_list[index],
          index: this.$numUppercase(index + 1),
          taskName: name,
          childrenId: projectModule_en + index,
          level: 2,
          id,
          weight,
          parentId: projectModule_en,
          _len: 'all',
          icons: [],
          _span: {
            config: [ {
              index: 1,
              len: this.projectManager ? 9 : 8,
              type: 'merge-row',
              align: 'left'
            } ]
          }
        })
        if (children.length !== 0) {
          children.map((child, i) => {
            const { name, id, pid, attributes = [] } = child;
            let { isMustFill } = attributes[0] || {};
            let icons = this.statusCheck(isMustFill);
            this.cascader[projectModule_en].push({
              index: i + 1,
              taskName: name,
              ...attributes[0],
              parentId: projectModule_en + index,
              level: 3,
              id,
              pid,
              ...icons,
              align: 'left'
            })
          })
        }
      })
      this.dealData();
    },
    dealData() {
      let arr = [];
      this.MAP_LIST.forEach((item) => {
        this.cascader[item] && this.cascader[item].forEach((item) => {
          arr.push(item);
        })
      });
      this.websData = arr;
    },

    // 获取计划列表
    async getPlanNodes() {
      const { data } = await this.$store.dispatch('ISDPOld/project/getPlanNodes', {
        projectId: this.$route.query.id
      })
      if(this.projectModel === 'SMALL') {
        this.SMALLWBSTemplate(data);
      } else if(this.projectModel === 'LARGE'){
        this.BIGWBSTemplate(data);
      }
    },
    // 获取成员列表
    async getTeamList() {
      let { data = [] } = await this.$store.dispatch(
        'ISDPOld/project/getTeamMember',
        {
          projectId: this.$route.query.id
        }
      );
      let dutyPersonList = [], arr = [], commArr = [], commDutyPerson = [];
      if(data && data[0] && data[0].list) {
        data = [ ...data[0].list, ...data[1].list ];
      }
      data &&
        data.forEach((item) => {
          const { staffName = '', staffNo = '',deptName = '' } = item;
          if(staffName && staffNo) {
            arr.push({
              label: (staffName || '') + ' ' + (staffNo || ''),
              value: (staffName || '') + '$$' + (staffNo || '') + '$$' + (deptName || '')
            });
            commArr.push({
              label: (staffName || '') + ' ' + (staffNo || ''),
              value: (staffName || '') + '-' + (staffNo || '')
            })
          }
        });
      arr.forEach((item) => {
        let flag = dutyPersonList.some((sbItem) => sbItem && sbItem.value === item.value);
        if (!flag) dutyPersonList.push(item);
      });
      commArr.forEach((item) => {
        let flag = commDutyPerson.some((comItem) => comItem && comItem.value === item.value);
        if (!flag) commDutyPerson.push(item);
      });
      this.remoteData = Object.assign({}, this.remoteData, {
        dutyPersonName: dutyPersonList,
        supportPersonName: commDutyPerson,
        taskReciver: commDutyPerson,
        actualEndDate: false
      });
    },
    async getApprovalList(formType = 1) { // 获取审批记录
      const { id } = this.$route.query;
      if(!id){
        return false;
      }
      await this.$store.dispatch('ISDPOld/project/getApprovalList',{projectId: id, formType});
    },
    async deleteWBSPlanNode(args) { // 删除计划
      const { resultCode, resultMessage } = await this.$store.dispatch('ISDP/project/deleteWBSPlanNode', args);
      this.$elMessage({
        type: +resultCode === 200 ? 'success' : 'error',
        message: resultMessage
      })
      if(+resultCode === 200) {
        this.getPlanNodes();
        this.$emit('getTask');
      }
    }
  },
  async mounted() {
    this.projectModel !== 'SMALL'
      && await this.getTeamList();
    await this.getPlanNodes();
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
