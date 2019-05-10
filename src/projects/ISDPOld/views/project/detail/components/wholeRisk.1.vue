<template>
  <div class="risk">
    <model-list :options="riskConfig"
                :data="data"
                :remoteData="remoteData"
                :pagination="pagination"
                class="project-risk-list-wrap"
                @callback="callback"></model-list>
    <outside-dialog :show="outsideDialogShow"
                    :options="dialogOptions"
                    :form="dialogForm"
                    :remoteData="remoteData"
                    @callback="handleCallbackForDialog"></outside-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import modelList from '@/components/modelList';
import Config from './config/whole.risk.config';
import outsideDialog from '@/components/outsideDialog';
const riskConfig = Config.listConfig,
  dialogConfig = Config.dialogConfig;

const IMPORTANCE_MAP = {
  commonly: '一般',
  importance: '重要',
  urgent: '紧急',
  urgentImportance: '紧急重要'
};
export default {
  components: {
    modelList,
    outsideDialog
  },
  data() {
    return {
      // riskConfig: JSON.parse(JSON.stringify(riskConfig)),
      dialogConfig: JSON.parse(JSON.stringify(dialogConfig)),
      saveRow: [],
      data: [],
      remoteData: {},
      outsideDialogShow: false,
      dialogForm: {},
      dialogOptions: {},
      pagination: {
        pageNum: 1,
        total: 0,
        pageCount: 15
      },
      obj: {
        projectId: this.$route.query.id,
        problemDesc: '',
        status: '',
        importanceLevel: '',
        submitPersonName: '',
        planStartDate: '',
        planEndDate: ''
      }
    };
  },
  computed: {
    ...mapState({
      projectModel(state) {
        const { detailData } = state.ISDPOld.project || {};
        const {projectModel } = detailData && detailData.data || {};
        return projectModel;
      },
      projectManager: (state)=>state.ISDPOld.project.projectManager
    }),
    riskConfig(){
      let obj = JSON.parse(JSON.stringify(riskConfig)),
        projectManager = this.projectManager;

      if(!projectManager){
        obj.btns.pop();
        obj.tableConfig.columns.pop();
      }
      return obj;
    }
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    handleClickForPlus() {
      this.getTeamList();
      let obj = this.dialogConfig;
      if (obj) {
        this.dialogOptions = obj;
        this.dialogForm = Object.assign({}, obj.data);
        this.outsideDialogShow = true;
      }
    },

    // model-table fn start
    handleCallbackForTable(fnName, data, rowData, rowOpts, iconOpts) {
      const { name: iconName } = iconOpts;
      if (iconName === 'remove') {
        let index = data.findIndex(
          (item) =>
            (item.id && item.id === rowData.id) ||
            (item._index && item._index === rowData._index)
        );
        data.splice(index, 1);
      }
    },
    // model-table fn end

    // outside-dialog fn start
    handleCallbackForDialog(fnName, args, obj, event) {
      this[fnName] && this[fnName](args, obj, event);
    },
    handleChangeForDatePicker(data){
      const {planStartDate, planEndDate} = data;
      if(planStartDate && planEndDate){
        let startTime = new Date(planStartDate).getTime(),
          endTime = new Date(planEndDate).getTime();

        if(startTime > endTime){
          data.planEndDate = '';
          this.$elMessage({
            message: '计划完成时间必须大于计划开始时间!',
            type: 'error'
          });
          return false;
        }
      }
    },
    beforeClose() {
      this.outsideDialogShow = false;
      Object.assign(this.dialogConfig.data, {});
    },
    outsideDialogSubmit() {
      const { dialogForm: args } = this;
      const params = {
        id: args.id,
        importanceLevel: this.findKey(IMPORTANCE_MAP, args.importanceLevel) || args.importanceLevel,
        status: args.status,
        happenDate: args.happenDate,
        dutyPersonName: args.dutyPersonName,
        dutyDept: args.dutyDept,
        problemDesc: args.problemDesc,
        submitPersonName: args.submitPersonName,
        planStartDate: args.planStartDate,
        planEndDate: args.planEndDate,
        actualEndDate: args.actualEndDate,
        deviationDay: args.deviationDay,
        problemClassify: args.problemClassify,
        solution: args.solution,
        memo: args.memo
      };
      if (this.action === 'edit') {
        if(this.regForm(params)) {
          this.modifyRiskProblem(params);
        }
      } else if(this.action === 'add') {
        if(this.regForm(params)) {
          this.addRiskProblem(params);
        }
      }
    },
    regForm(args) {
      let msg = '';
      switch (true) {
      case !args.importanceLevel:
        msg = '请选择重要程度';
        break;
      case !args.happenDate:
        msg = '请选择发生时间';
        break;
      case !args.submitPersonName:
        msg = '请选择提交人';
        break;
      case !args.problemClassify:
        msg = '请选择问题类型';
        break;
      case !args.problemDesc:
        msg = '请输入问题描述';
        break;
      // case !args.solution:
      //   msg = '请输入进展、解决方案描述';
      //   break;
      case !args.dutyPersonName:
        msg = '请选择责任人';
        break;
      case !args.planStartDate:
        msg = '请选择计划开始时间';
        break;
      case !args.planEndDate:
        msg = '请选择计划结束时间';
        break;
      // case !args.actualEndDate:
      //   msg = '请选择实际完成时间';
      //   break;
      default:
        break;
      }

      if (msg) {
        this.$elMessage({
          message: msg,
          type: 'error'
        });
        return false;
      }
      return true;
    },
    findKey(obj, value, callback = (a, b) => a === b) {
      return Object.keys(obj).find((k) => callback(obj[k], value));
    },
    async getRiskList() {
      this.data = [];
      const {pageNum, pageCount} = this.pagination;
      const { obj } = this;
      const { data } = await this.$store.dispatch(
        'ISDPOld/project/getRiskList',
        {
          pageNum,
          pageCount,
          sortColumn: 'importanceLevel',
          sortType: 'desc',
          obj
        }
      );
      if (data) {
        this.pagination.total = data.totalElements;
        data.content.map((item, index) => {
          const params = {
            id: item.id,
            importanceLevel: IMPORTANCE_MAP[item.importanceLevel],
            status: item.status,
            happenDate: item.happenDate,
            dutyPersonName: item.dutyPersonName,
            dutyDept: item.dutyDept,
            problemDesc: item.problemDesc,
            submitPersonName: item.submitPersonName,
            planStartDate: item.planStartDate,
            planEndDate: item.planEndDate,
            actualEndDate: item.actualEndDate,
            deviationDay: item.deviationDay,
            problemClassify: item.problemClassify,
            solution: item.solution,
            memo: item.memo
          };
          this.data.push({
            ...params,
            index: index + 1,
            staffNo: params.submitPersonName
          });
        });
      }
    },
    async modifyRiskProblem(args){
      const { resultMessage, resultCode } = await this.$store.dispatch(
        'ISDP/project/modifyRiskProblem',
        {
          projectId: this.$route.query.id,
          ...args
        }
      );
      this.$elMessage({
        message: resultMessage,
        type: resultCode == 200 ? 'success' : 'error'
      });
      this.outsideDialogShow = false;
      this.data = [];
      this.getRiskList();
    },
    // 获取成员列表
    async getTeamList() {
      const { data } = await this.$store.dispatch(
        'ISDPOld/project/getTeamMember',
        {
          projectId: this.$route.query.id
        }
      );
      let dutyPersonList = [], arr = [], commArr = [], commDutyPerson = [];
      // let mapList = this.dialogConfig.riskList.group[0].formConfig;
      data &&
        data.forEach((item) => {
          if(this.projectModel === 'SMALL') {
            const { staffName = '', staffNo = ''} = item;
            if(staffName && staffNo) {
              arr.push({
                label: (staffName || '') + ' ' + (staffNo || ''),
                value: staffName
              });
              commArr.push({
                label: (staffName || '') + ' ' + (staffNo || ''),
                value: staffName
              })
            }
          } else {
            item.list &&
            item.list.forEach((res) => {
              const { staffName = '', staffNo = ''} = res;
              if(staffName && staffNo) {
                arr.push({
                  label: (staffName || '') + ' ' + (staffNo || ''),
                  value: staffName
                });
                commArr.push({
                  label: (staffName || '') + ' ' + (staffNo || ''),
                  value: staffName
                })
              }
            });
          }
        });
      arr.forEach((item) => {
        let flag = dutyPersonList.some((sbItem) => sbItem && sbItem.value === item.value);

        if (!flag) {
          dutyPersonList.push(item);
        }
      });
      commArr.forEach((item) => {
        let flag = commDutyPerson.some((comItem) => comItem && comItem.value === item.value);
        if (!flag) {
          commDutyPerson.push(item);
        }
      })
      this.remoteData = Object.assign({}, this.remoteData, {
        submitPersonName: dutyPersonList
      });
      this.remoteData = Object.assign({}, this.remoteData, {
        dutyPersonName: commDutyPerson
      });
    },
    edit(data, rowData, ddd, iconOpts){
      const { name: iconName } = iconOpts;
      if(iconName) {
        this.dialogConfig.title = '编辑团队成员信息'
        Object.assign(this.dialogConfig.data, rowData);
        this.action = iconName;
        this.handleClickForPlus('riskList');
      }
    },
    // 分页回调
    paginationCallback(num) {
      this.pagination.pageNum = num;
      this.getRiskList();
    },
    remove(data, rowData, dd, iconOpts) {
      this.$confirm('确定要删除该风险问题信息吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const { name: iconName } = iconOpts;
          if (iconName) {
            this.action = iconName;
          }
        })
        .catch(() => {
          // this.action = '';
        });
    },
    handleKeyupForEnter(form) {
      this.obj = Object.assign({}, this.obj, form);
      this.getRiskList();
    },
    handleClickForSubmit(opts,args) {
      if (opts.name === 'add') {
        this.action = 'add';
        this.dialogConfig.title = '添加风险及问题';
        this.dialogConfig.data.status = 'Open';
        this.handleClickForPlus();
      } else if(opts.name === 'search') {
        this.obj = {
          ...args,
          projectId: this.$route.query.id,
          planStartDate: args.planEndDate && args.planEndDate[0],
          planEndDate: args.planEndDate && args.planEndDate[1]
        }
        this.getRiskList();
      }
    },
    async addRiskProblem(args) {
      const { resultMessage, resultCode } = await this.$store.dispatch(
        'ISDP/project/addRiskProblem',
        {
          projectId: this.$route.query.id,
          ...args
        }
      );
      this.$elMessage({
        message: resultMessage,
        type: resultCode == 200 ? 'success' : 'error'
      });
      this.outsideDialogShow = false;
      this.data = [];
      this.getRiskList();
    },
    handleDBLClickForRow(data){
      Object.assign(this.dialogConfig.data, data);
      this.handleClickForPlus('riskList');
    }
  },
  async created() {
    await this.getRiskList();
  }
};
</script>
<style lang="less" scoped>
  .risk {
    button {
      padding: 8px 10px;
      margin-left: 30px;
    }
  }
</style>
<style lang="less">
  .risk {
    .model-form-item-wrap {
      .el-form-item__label {
        line-height: 24px;
      }
    }
    .project-risk-list-wrap {
      .form-item-wid {
        .el-input__inner {
          width: 120px;
        }
      }
    }
  }
</style>
