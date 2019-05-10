<template>
  <div class="manage-plan">
    <!-- <el-button type="danger"
               @click.native.prevent="handleClickForPlus('settingNodes')">
      <i class="icon fa fa-plus"></i> 添加关键节点
    </el-button> -->
    <el-button type="danger"
               v-if="projectManager && (!detailData.milestoneApprovalStatus || ['NOT_PASS','NOT_COMMIT'].includes(detailData.milestoneApprovalStatus))"
               @click="addMilestoneNode('save')">
      <i class="icon far fa-save"></i> 保存
    </el-button>
    <el-button v-if="projectManager && (!detailData.milestoneApprovalStatus || ['NOT_PASS','NOT_COMMIT'].includes(detailData.milestoneApprovalStatus))"
               type="danger"
               size="small"
               @click="addMilestoneNode('submit')">
      <i class="icon fas fa-plus"></i> 提交审批
    </el-button>
    <el-row :gutter="30"
            class="flex">
      <!-- 时间阶段 -->
      <el-col :span="12"
              class="flex-wrap flex-item"
              :gutter="30"
              v-for="(item, index) of stageProgress"
              :key="item.id">
        <span class="title">{{item.title}}</span>
        <el-row class="date-item">
          <!-- <el-col :span="1"
                  class="el-icon-date"></el-col> -->
          <el-col :span="10">
            <el-date-picker size="small"
                            prefix-icon="el-icon-date"
                            value-format="yyyy-MM-dd"
                            v-model="item.planStartDate"
                            placeholder="计划开始时间"
                            @change="handleChangeForDatePicker(item)"
                            :defaultValue="(index - 1 >= 0 && stageProgress[index-1].planEndDate) || item.planEndDate">
            </el-date-picker>
          </el-col>
          <!-- <el-col :span="1"
                  :offset="+1"
                  class="el-icon-success"></el-col> -->
          <el-col :span="10"
                  :offset="3">
            <el-date-picker prefix-icon="el-icon-success"
                            size="small"
                            value-format="yyyy-MM-dd"
                            placeholder="计划结束时间"
                            v-model="item.planEndDate"
                            @change="handleChangeForDatePicker(item)"
                            :defaultValue="(index - 1 >= 0 && stageProgress[index-1].planEndDate) || item.planEndDate">
            </el-date-picker>
          </el-col>
        </el-row>
        <!-- checkbox -->
        <el-row>
          <div class="flex check-box"
               v-for="(check, idx) of item.progress"
               :key="check.id">
            <div class="flex-item">
              <el-checkbox-group v-model="item.checked">
                <el-checkbox class="check-list"
                             :label="check.value"
                             @change="pickDate(check.planEndDate,stageProgress[index].checked,stageProgress[index].progress,check.value, index, stageProgress[index].planStartDate)">
                </el-checkbox>
                <span v-if="!check.edit"
                      @dblclick="changeMielstone(idx, index)">{{check.value}}</span>
                <el-input v-else
                          class="mielstone-input"
                          type="text"
                          size="small"
                          v-model.trim="check.value"
                          @blur="blurAddNewRow(idx, index, check.value)"></el-input>
              </el-checkbox-group>
            </div>
            <div class="flex-auto">
              <span class="date-right">
                <i class="icon far fa-clock"></i>
              </span>
              <el-date-picker prefix-icon="null"
                              class="end-date"
                              size="small"
                              placeholder="计划完成时间"
                              @change="pickDate(check.planEndDate,stageProgress[index].checked,stageProgress[index].progress,check.value, index, stageProgress[index].planStartDate)"
                              value-format="yyyy-MM-dd"
                              v-model="check.planEndDate"
                              :defaultValue="check.planEndDate">
              </el-date-picker>
            </div>
            <span class="flex-delete"></span>
          </div>
        </el-row>
      </el-col>
      <!-- 使用蒙层禁用编辑页面 -->
      <div class="manage-mask"
           v-if="!projectManager || detailData.milestoneApprovalStatus === 'APPROVING'
                 || detailData.milestoneApprovalStatus === 'PASS'"></div>
    </el-row>
    <div class="project-approval-list"
         v-if="approvalList.length">
      <model-table :options="approvalConfig.approvalList"
                   :data="approvalList"></model-table>
    </div>
    <section>
      <iframe :src="approvalUrl"
              v-if="approvalUrl"
              class="frame mt-2"
              name="approval"
              frameborder="0"></iframe>
      <el-button class="refreshBtn"
                 v-show="false"
                 @click="refreshFn"></el-button>
    </section>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import modelTable from '@/components/modelList/modelTable';
import Config from './config/manage.config';
import approvalConfig from '../contract/components/config/projectApproval.config';
const modelFormGroup = () => import('@/components/modelFormGroup');

const { stageProgress } = Config.manageConfig;
const STAGE_MAP = {
  startStage: 0,
  design: 1,
  schemeImplementation: 2,
  projectAcceptance: 3
}
export default {
  components: {
    modelTable,
    modelFormGroup
  },
  data() {
    return {
      // websData, // WBS计划表格
      stageProgress: JSON.parse(JSON.stringify(stageProgress)),
      dialogConfig: Config.dialogConfig,
      // config,
      dialogOptions: {},
      milestoneList: [],
      approvalConfig,
      formData: {},
      outsideDialogShow: false,
      showModel: false,
      refuse: -1,
      approvalUrl: ''
    };
  },
  computed: {
    ...mapState({
      projectManager: (state) => state.ISDPOld.project.projectManager || '',
      approvalList: (state) =>state.ISDPOld.project.approvalList || [],
      projectManagerSuperior: (state) => state.ISDPOld.project.projectManagerSuperior || '',
      detailData: (state) => {
        let detail = state.ISDPOld.project.detailData || {};
        return detail.data || {};
      },
      reasonType() {
        if(this.projectManagerSuperior) return this.refuse ? '通过意见' : '拒绝原因'
        return '申请原因'
      }
    })
  },
  methods: {
    handleCallbackForDialog(fnName, args, obj, event) {
      this[fnName] && this[fnName](args, obj, event);
    },
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    handleClickForPlus(name) {
      let obj = this.dialogConfig[name];
      if (obj) {
        this.dialogOptions = obj;
        this.dialogForm = Object.assign({}, obj.data);
        this.outsideDialogShow = true;
      }
    },
    handleChangeForDatePicker(currentItme){
      const {planEndDate,planStartDate} = currentItme;
      if(planEndDate && planStartDate){
        let endTime = new Date(planEndDate).getTime(),
          startTime = new Date(planStartDate).getTime();

        if(startTime > endTime){
          currentItme.planEndDate = '';
          this.$elMessage({
            message: '结束时间必须大于开始时间!',
            type: 'error'
          });
          this.showModel = false;
          return false;
        }
      }
    },
    changeMielstone(idx, index) {
      let last = this.stageProgress[index].progress.length - 1;
      if(last === idx) {
        this.stageProgress[index].progress[idx].edit = true;
        this.stageProgress = Object.assign([],this.stageProgress);
      }
    },
    blurAddNewRow(idx, index, value) {
      let progress = JSON.parse(JSON.stringify(this.stageProgress[index].progress));
      progress.pop();
      let flag = progress.some((item) => {
        if(!value) {
          this.$elMessage({
            type: 'error',
            message: '节点名称不能为空！'
          })
          return true;
        }else if(item.value === value || value === '其他') {
          this.$elMessage({
            type: 'error',
            message: `${ value } - 已在里程碑计划列表中！`
          })
          return true;
        }
      });
      if(flag) return false;
      this.stageProgress[index].progress[idx].edit = false;
      this.stageProgress[index].progress.push({
        label: '其他',
        value: '其他',
        planEndDate: '',
        edit: false
      })
      this.stageProgress = Object.assign([], this.stageProgress);
    },
    // 节点日期选择
    async revokeApproval() {
      const { resultCode, resultMessage } = await this.$store.dispatch('ISDP/project/revokeApproval', {
        projectId: this.$route.query.id,
        milestoneApprovalStatus: 'NOT_COMMIT',
        revoke: true
      })
      if( +resultCode === 200) {
        this.getDetail();
        this.getMilestoneList();
      }
      this.$elMessage({
        type: +resultCode === 200 ? 'success' : 'error',
        message: resultMessage
      })
    },
    pickDate(date, checkList, progress, checkValue, INDEX, startDate) {
      let isChecked = checkList.findIndex((item) => (item === checkValue));
      if(isChecked === -1) {
        return ;
      }
      let arr = [];
      progress.forEach((item) => {
        checkList.forEach((check) => {
          if(check === item.value) {
            arr.push(new Date(item.planEndDate).getTime() || 0);
          }
        })
      })
      let max = arr.length > 1 ? arr.sort((a,b)=> a - b).pop() : arr[0];
      if(max) {
        if(max <= new Date(startDate).getTime()){
          this.$elMessage({
            type: 'error',
            message: '结束时间不能小于阶段开始时间'
          })
          this.showModel = false;
          return ;
        };
        max = new Date(max).format();
        this.stageProgress[INDEX].planEndDate = max;
      }
    },
    handleClickForFold(row) {
      row._active = !row._active;
      let idx = this.sessionRow.findIndex((item) => item === row.childrenId);
      if (idx < 0) {
        this.sessionRow.push(row.childrenId);
      } else {
        this.sessionRow.splice(idx, 1);
      }
    },
    regexForAddMilestone(args, title) {
      let msg = '';
      switch(true) {
      case !args.planStartDate:
        msg = `${ title } 计划开始时间时间未输入！`;
        break;
      case !args.planEndDate:
        msg = `${ title } 计划结束时间时间未输入！`;
        break;
      default:
        break;
      }
      if(msg) {
        this.$elMessage({
          type: 'error',
          message: msg
        });
        this.submitFlag = true;
        return true;
      }
      return false;
    },
    // 里程碑阶段信息添加
    async addMilestoneNode(approval){
      let status = approval === 'submit' ? 'APPROVING' : 'NOT_COMMIT';
      let checkedList = [];
      let flag = false;
      for(let stage of this.stageProgress) {
        const { checked, progress, name, planStartDate, planEndDate, title, id } = stage;
        let obj = {
          stage: STAGE_MAP[name],
          planStartDate,
          planEndDate,
          id,
          isParent: 1
        }
        checkedList.push(obj);
        if(this.regexForAddMilestone(stage, title)) {
          flag = true;
          break;
        }
        if(progress) {
          for(let progressItem of progress) {
            const { planEndDate = '', id = '', value = '' } = progressItem || {};
            // push对象
            obj = {
              milestoneNoteName: value,
              stage: STAGE_MAP[name],
              planEndDate,
              id,
              checked: 0,
              isParent: 0
            }
            for(let item of checked){
              if(progressItem.value === item){
                obj.checked = 1;
                if(!obj.planEndDate){
                  this.$elMessage({
                    type: 'error',
                    message: `${ title }-${ item } 节点时间未输入！`
                  })
                  flag = true;
                  break;
                }
              } else if(!progressItem.value) {
                this.$elMessage({
                  type: 'error',
                  message: `${ title } 节点名称不能为空！`
                })
                flag = true;
                break;
              }
            }
            checkedList.push(obj)
          }
        }
      }
      if(flag) return false;
      const { resultCode = 0, resultMessage} = await this.$store.dispatch('ISDP/project/addPlanNode', {
        id: this.$route.query.id,
        milestoneNoteArray: checkedList,
        milestoneApprovalStatus: status
      })
      if(+resultCode === 200) {
        this.stageProgress = JSON.parse(JSON.stringify(stageProgress));
        if(approval === 'save') {
          this.$elMessage({
            type: 'success',
            message: '保存成功！'
          })
        }
        this.showModel = false;
        this.getMilestoneList();
        this.getDetail();
        this.getApprovalUrl();
        return false;
      }
      this.$elMessage({
        type: 'error',
        message: resultMessage
      })
    },
    // 获取里程碑阶段列表
    async getMilestoneList() {
      let { data } = await this.$store.dispatch(
        'ISDPOld/project/getMilestoneList',
        {
          projectId: this.$route.query.id,
          isSurvey: false
        }
      );
      if (data) {
        const { parent, child } = data;
        this.stageProgress = this.stageProgress.map((stageItem, index) => {

          stageItem.id = parent[index] && parent[index].id;
          stageItem.planStartDate =
            parent[index] && parent[index].planStartDate;
          stageItem.planEndDate =
            parent[index] && parent[index].planEndDate;
          if(child[index]) {
            let nodes = [], checkArr = [];
            stageItem.checked = [];
            child[index] && child[index].map((item) => {
              nodes.push({
                id: item.id,
                planEndDate: item.planEndDate,
                value: item.milestoneNoteName
              })
              if(item.checked) {
                checkArr.push(item.milestoneNoteName);
              }
              return item;
            });
            stageItem.progress = nodes;
            stageItem.checked = checkArr;
          }

          return stageItem
        });
      }
    },
    // 获取detail
    getDetail(){
      this.$store.dispatch('ISDPOld/project/getProjectDetail',{
        id: this.$route.query.id
      });
    },
    beforeClose() {
      this.outsideDialogShow = false;
    },
    async getApprovalUrl(){
      let { data } = await this.$store.dispatch('common/getApproval',{
        projectId: this.$route.query.id,
        formType: 2
      });
      this.approvalUrl = data;
    },
    refreshFn(){
      this.getDetail();
      this.getMilestoneList();
      this.getApprovalUrl();
    }
  },
  async created() {
    this.getApprovalUrl();
    await this.getMilestoneList();
  }
};
</script>

<style lang="less" scoped>
  .title {
    display: block;
    font-size: 16px;
    font-weight: 600;
    line-height: 32px;
  }
  .date-item {
    margin: 10px 0;
    i {
      font-size: 16px;
      margin: 0 15px;
    }
  }
</style>
<style lang="less">
  .el-button--danger {
    background-color: #ef4d4d;
    border-color: #ef4d4d;
  }
  .btn-default {
    color: #ef4d4d;
    border-color: #ef4d4d;
    &:hover {
      color: #ef4d4d;
      border-color: #ef4d4d;
      background-color: #fff;
    }
  }
  .manage-plan {
    .frame {
      height: 600px;
      width: 100%;
    }
    .manage-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 99;
    }
    .project-mielstons-change-group {
      width: 70%;
      margin-left: 8%;
    }
    .el-checkbox {
      line-height: 30px;
      margin-left: 0px;
    }
    > .el-row {
      padding: 0 40px;
      margin-bottom: 30px;
      flex-wrap: wrap;
      .flex-wrap {
        min-width: 200px;
        min-width: 50%;
        margin-bottom: 30px;
      }
    }
    .btn-group {
      .el-button {
        padding: 8px 10px;
      }
    }
    .date-item {
      .el-icon-date,
      .el-icon-success {
        text-align: left;
      }
      .el-col {
        display: flex;
        line-height: 32px;
        justify-content: flex-start;
        text-align: right;
        font-size: 20px;
        color: #666;
        &:first-child {
          justify-content: left;
        }
        .el-input {
          width: 100%;
        }
        .el-input__inner {
          width: 100%;
          padding: 0 0 0 30px;
        }
      }
    }
    .el-checkbox-group {
      height: 100%;
      font-size: 15px;
      > span {
        margin-left: 8px;
      }
      .mielstone-input {
        width: auto;
        margin-left: 8px;
        > input {
          border: none;
          border-radius: 0;
          border-bottom: 1px solid #ddd;
        }
      }
      .el-checkbox__label {
        display: none;
      }
    }
    .check-box {
      height: 32px;
      overflow: hidden;
      .flex-delete {
        width: 32px;
        height: 32px;
        margin-right: 6%;
        line-height: 32px;
        text-align: center;
        color: #999;
      }
      a {
        margin-left: 6px;
        color: #ef4d4d;
        font-size: 12px;
      }
      .end-date {
        // float: right;
        width: 120px;
        vertical-align: top;
        // margin-right: 6%;
        .el-input__inner {
          padding: 0 12px;
          border: none;
          border-bottom: 1px solid #dcdfe6;
          border-radius: 0;
          line-height: 32px;
        }
      }
      .date-right {
        height: 32px;
        margin-right: 5px;
        .icon {
          height: 20px;
          margin-top: 9px;
          font-size: 20px;
          color: #999;
        }
        .plan-date {
          width: 120px;
          height: 32px;
          line-height: 32px;
          vertical-align: top;
          margin-left: 5px;
          text-indent: 8px;
          border-bottom: 1px solid #e6e6e6;
        }
      }
    }
    .el-checkbox__inner {
      background-color: #fff;
      border-color: #666;
      height: 20px;
      width: 20px;
      &::after {
        left: 7px;
        height: 12px;
      }
    }
    .el-checkbox__label {
      font-size: 15px;
      line-height: 32px;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #666;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #666;
    }
    .el-checkbox__label {
      font-size: 15px;
      line-height: 32px;
      display: inline-block;
      width: 100%;
      white-space: normal !important;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-indeterminate .el-checkbox__inner {
      background-color: #666;
      border-color: #666;
      word-wrap: break-word;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #666;
    }
  }
</style>
<style lang="less">
  .manage-plan {
    .el-checkbox {
      display: inline-block;
    }
    button {
      padding: 8px 10px;
      margin-bottom: 30px;
      margin-left: 40px;
    }
    .el-checkbox__input {
      vertical-align: top;
      transform: translateY(5px);
    }
  }
</style>
