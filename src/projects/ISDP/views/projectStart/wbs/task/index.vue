<template>
  <div class="wbs-task">
    <div class="flex">

      <!-- 任务列表 -->
      <section class="child-task">
        <inside-head :options="childTask"></inside-head>
        <model-table :options="childTaskConfig"
                     :data="childTaskList"
                     @callback="callback"></model-table>
      </section>

      <!-- 任务详情 -->
      <section class="right-content flex-item">
        <inside-head :options="taskInfomation"
                     @callback="callback"></inside-head>
        <div class="task-info">
          <div class="title">任务名称： {{taskInfo && taskInfo.jobName || ''}}</div>
          <div class="content">
            <div class="flex">
              <div class="con-item">
                <span class="label">编号：</span>
                {{taskInfo && taskInfo.jobNo || ''}}
              </div>
              <div class="con-item">
                <span class="label">负责部门：</span>
                {{taskInfo && taskInfo.projectModuleCN || ''}}
              </div>
              <div class="con-item">
                <span class="label">计划完成时间：</span>
                {{taskInfo && taskInfo.planEndDate || ''}}
              </div>

            </div>
            <div class="flex">
              <div class="con-item">
                <span class="label">子任务描述：</span>
                {{taskInfo && taskInfo.jobDescription || ''}}
              </div>
            </div>

          </div>
        </div>
        <div class="file-upload">
          <inside-head :options="fileUpload"
                       @callback="callback"></inside-head>
          <model-table ref="fileUplaod"
                       :options="fileConfig"
                       :data="fileList"
                       class="file-upload-table"
                       @callback="callback"></model-table>
        </div>
      </section>
    </div>

    <!-- 弹窗部分 -->
    <inside-dialog :options="options"
                   :show="showDialog"
                   @callback="callback">
      <!-- 退回 -->
      <template v-if="action === 'back'"
                slot="content">
        <div class="back"><i class="el-icon el-icon-warning"></i>请与项目经理确认再退回！</div>
      </template>
      <!-- 转发 -->
      <template v-else-if="action === 'relay'"
                slot="content">
        <div class="relay">
          <div class="relay-item">
            <span class="label">姓名： </span>
            <!-- :multiple="formItemOpts.multiple"
             :collapse-tags="formItemOpts.collapseTags"
             :allow-create="formItemOpts.allowCreate" -->
            <model-select :options="relayOptions"
                          :form="relay"
                          :remoteData="remoteData"
                          @callback="callback"></model-select>
          </div>
          <div class="relay-item">
            <span class="label">工号： </span>
            <el-input v-model.trim="relay.dutyPersonNo"></el-input>
          </div>
        </div>
      </template>
      <!-- 超期 -->
      <template v-else-if="action === 'publish'"
                slot="content">
        <div class="overtime">
          <div class="overtime-item flex">
            <span class="label">超期原因： </span>
            <div class="el-textarea-content">
              <el-input type="textarea"
                        maxlength="400"
                        v-model.trim="overtime.reason"></el-input>
              <span class="count-position">{{overtime.reason && overtime.reason.length || 0}}/400</span>
            </div>
          </div>
        </div>
      </template>
      <!-- 交付件上传 -->
      <template v-else-if="action === 'upload'"
                slot="content">
        <div class="upload">
          <el-form class="relay"
                   ref="relay"
                   :model="uploadForm">
            <el-form-item class="relay-item"
                          label="交付件名称："
                          prop="fileName"
                          :rules="[{required: true, message: '请填写交付件名称', trigger: 'blur'}]">
              <el-input v-model.trim="uploadForm.fileName"></el-input>
            </el-form-item>
            <el-form-item class="relay-item"
                          label="是否上传交付件：">
              <div class="upload-box">
                <el-radio v-model="uploadForm.isMustFill"
                          :label="1">是</el-radio>
                <el-radio v-model="uploadForm.isMustFill"
                          :label="0">否</el-radio>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </template>
    </inside-dialog>
  </div>
</template>

<script>
import modelTable from '@/components/modelList/modelTable';
import insideHead from '@ISDP/components/insideHead';
import insideDialog from '@ISDP/components/insideDialog';
import modelUpload from '@/components/modelFormGroup/components/upload';
import modelSelect from '@/components/modelFormGroup/components/select';

import childTaskConfig from './config/childtask.config.json';
import fileConfig from './config/file.config.json';
import headConfig from './config/head.config.json';
import dialogConfig from './config/dialog.config.json'

// let time = null;
export default {
  name: 'wbs-task',
  components: {
    modelSelect,
    insideHead,
    modelUpload,
    insideDialog,
    modelTable
  },
  data() {
    return {
      ...dialogConfig,
      ...headConfig,
      fileConfig,
      insideDialog,
      childTaskConfig,
      options: {}, // default options
      showDialog: false,
      action: '', // 操作行为标记
      overtime: { // 超期弹窗
        reason: ''
      },
      // pagination: { // 分页
      //   theme: 'isdp',
      //   pageCount: 3,
      //   pageNum: 1,
      //   total: 3
      // },
      uploadId: '',
      taskInfo: {}, // 子任务详情
      taskId: +this.$route.query.taskId || '', // 查询任务id
      fileList: [], // 交付件列表
      childTaskList: [],
      realy: {
        dutyPersonNo: '',
        dutyPersonName: ''
      },
      remoteData: {},
      relayOptions: {
        prop: 'dutyPersonName',
        align: 'center',
        type: 'select',
        select: [],
        formItemOpts: {
          filterable: true,
          allowCreate: false,
          remote: true,
          width: 230,
          size: 'small'
        }
      },
      uploadForm: {
        isMustFill: 1,
        fileName: ''
      }
    }
  },
  computed: {
    projectId() {
      const {projectId,id} = this.$route.query;
      return projectId ||  id;
    }
  },
  methods: {
    callback(fnName, ...args) {
      this[fnName] && this[fnName](...args);
    },
    // 上传
    handleClickForFileUpload() {
      const { upload } =  this;
      this.showDialog = true;
      this.action = 'upload';
      this.options = Object.assign({}, this.options, upload)
    },
    // 退回
    handleForBack() {
      const { back } = this;
      this.showDialog = true;
      this.options = Object.assign({}, this.options, back);
      this.action = 'back';
    },
    // 转发
    handleForRelay() {
      const { relay } = this;
      this.showDialog = true;
      this.options = Object.assign({}, this.options, relay);
      this.action = 'relay';
    },
    // 召回
    handleForCallback() {
      this.action = 'callback';
      this.recallPlan();
    },
    // 接受
    handleForAccept() {
      this.action = 'accept';
      this.acceptPlan();
    },
    // 发布 (反馈)
    handleForPublish() {
      const { overTime } = this;
      // console.log((new Date()).setHours(0).setSeconds(0).setMinutes(0).setMilliseconds(0));

      let now = new Date(),
        planEndDate = new Date(this.taskInfo.planEndDate).getTime();
      now.setSeconds(0);
      now.setHours(0);
      now.setMinutes(0);
      now.setMilliseconds(0);
      now = now.getTime();
      if(now > planEndDate) {
        this.showDialog = true;
        this.options = Object.assign({}, this.options, overTime);
        this.action = 'publish';
      }else {
        this.overtime.reason = '';
        this.feedbackSubTask();
      }
    },
    handleClickForRow(row, column) {
      // console.log(row, column);
      const { id } = row,
        { property } = column;
      if(property === 'jobName' || property === 'progressStatus') {
        if(id === this.taskId) return;
        this.taskId = id;
        this.$router.push({
          name: this.$route.name,
          query: { taskId: id, id: this.projectId || ''}
        })
        this.getSubTaskDetail(id);
      }
    },
    handleForSubmit() {
      const { action } = this;
      switch(action) {
      case 'back':
        this.reSubTask();
        return ;
      case 'publish':
        this.feedbackSubTask();
        return ;
      case 'relay':
        this.forwardPlan();
        return ;
      case 'accept':
        this.acceptPlan();
        return ;
      case 'upload':
        this.$refs.relay.validate((valid) => {
          if(valid) {
            this.saveNewDeliverable();
          }
        });
        return ;
      default:
        return ;
      }
    },
    // 上传成功回调
    onSuccessForUpload(result) {
      const { id, originFileName } = result && result.data || {};
      this.saveDeliverable({myFileId: id, myFileName: originFileName, id: this.uploadId });
    },
    handleForUpload(row) {
      // console.log(row)
      this.uploadId = row.id;
    },
    // handleChangeForSelect(args) {
    //   // console.log(args);
    //   clearTimeout(time);
    //   time = setTimeout(() => {
    //     this.getEmplyees(args);
    //   }, 300);
    // },
    handleChangeForSelected(data, form, val) {
      const personInfoArr = val.split('$$'),
        dutyPersonName = personInfoArr[0],
        dutyPersonNo = personInfoArr[1];
      this.relay = {
        dutyPersonName,
        dutyPersonNo
      }
    },
    // 获取员工信息
    async getEmplyees(StrKey) {
      let { data } = await this.$store.dispatch('ISDP/project/getEmplyees', {
        StrKey
      });
        // console.log(data);
      if (data) {
        data = data.splice(0, 10);
        this.dealData(data);
      } else {
        this.remoteData = Object.assign({}, this.remoteData, {
          dutyPersonName: data
        });
      }
    },
    dealData(data = []) {
      let nickname = data.map((item) =>
        Object.assign({}, item, {
          value:
              item.displayName +
              '$$' +
              item.userName +
              '$$' +
              item.email +
              '$$' +
              item.tel +
              '$$' + item.depName,
          label: item.displayName + ' ' + item.userName
        })
      );
      this.remoteData = Object.assign({}, this.remoteData, { dutyPersonName: nickname });
    },
    // 新增交付件上传
    async saveNewDeliverable() {
      const { isMustFill = 1, fileName: name } = this.uploadForm;
      const { jobNo: planCode } = this.taskInfo;
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/saveNewDeliverable', {
        name,
        isMustFill,
        projectId: this.projectId,
        planCode,
        feedbackByTemplate: 0
      })
      if(+resultCode === 200 || resultCode.includes('200')) {
        this.$elMessage({
          type: 'success',
          message: resultMessage
        });
        this.getSubTaskDetail(this.$route.query.taskId);
        this.showDialog = false;
        this.uploadForm = { fileName: '', isMustFill: 1 };
      }
    },
    async deleteDeliverable(row) {
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/deleteDeliverable', { id: row.id });
      if(+resultCode === 200 || resultCode.includes('200')) {
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.getSubTaskDetail(this.$route.query.taskId);
      }
    },
    deleteRow(row) {
      this.$confirm('此操作将会删除上传文件', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        type: 'warning'
      }).then(() => {
        this.deleteDeliverable(row)
      })

    },
    //  子任务列表
    async getMyTaskList() {
      const { data, resultCode = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/getMyTaskList', {
          projectId: this.projectId || '',
          projectModule: ''
        }),
        { taskId: id } = this.$route.query;
      if(+resultCode === 200 || resultCode.includes('200')) {
        this.childTaskList = data;
        if(data && data.length > 0) {
          this.fileUpload.btns = [ {
            fnName: 'handleClickForFileUpload',
            text: '添加',
            type: 'iconAdd'
          } ]
          !id && this.$router.push({
            name: this.$route.name,
            query: { id: this.projectId, taskId: data[0].id }
          })
          if(data[0].id && !this.taskId) {
            this.taskId = data[0].id;
            this.getSubTaskDetail(this.taskId);
          }
        } else {
          this.taskId = '';
          this.taskInfo = {};
          this.taskInfomation.btns = [];
          this.fileUpload.btns = [];
        }
      }
    },
    async getProjectMemberList() {
      const { data, resultCode = '' } = await this.$store.dispatch('ISDP/progressManage/queryChildPlanPerson', {
        id: this.$route.query.id
      })
      if(+resultCode === 200 || resultCode.includes('200')) {
        if (data) {
          // console.log(data);
          this.dealData(data);
        } else {
          this.remoteData = Object.assign({}, this.remoteData, {
            dutyPersonName: data
          });
        }
      }
    },
    // 子任务详情
    async getSubTaskDetail(id) {
      const { taskId, businessNo: jobNo, projectId } = this.$route.query;
      const params = taskId || id ? { id } : {
        jobNo,
        issue: 1,
        projectId
      };
      const btns = [ {
        name: 'clickForUpload',
        type: 'upload',
        uploadType: 1,
        text: '上传',
        formItemOpts: {
          showFileList: false
        }
      },
      {
        name: 'downloadFile',
        text: '查看'
      },
      {
        name: 'deleteRow',
        text: '删除'
      },
      {
        name: 'downloadTemplate',
        text: '下载模板'
      }
      ];
      const { data, resultCode = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/getSubTaskDetail', params);
      if(+resultCode === 200 || resultCode.includes('200')) {
        this.taskInfo = data || {};
        this.planStatusBtns(data);
        this.fileList = (data && data.deliverableDTOList || []).map((item) => {
          if(item.feedbackByTemplate) { // 是否需要模板下载按钮
            item.download = { icons: [ btns[3] ]}
          }else {
            item.download = { icons: [] }
          }
          if(!item.isCustom){ // 是否需要交付件删除操作
            item.operate = { icons: [] }
          } else {
            item.operate = { icons: [ btns[2] ] }
          }
          if(+item.uploadStatus === 1) { // 是否根据交付件上传状态判断
            item.partFileUpload = {
              icons: [ btns[0], btns[1] ]
            };
          }else {
            item.partFileUpload = {
              icons: [ btns[0] ]
            }
          }
          return item;
        });
      }
    },
    // 状态判断
    planStatusBtns(data) {
      // UNALLOCATED: '未派发',
      // ACCEPTED: '已接受',
      // FEEDBACK: '已反馈',
      // COMPLETED: '已完成'
      let arr = [];
      const btns = [ {
        fnName: 'handleForAccept',
        text: '接受'
      }, {
        fnName: 'handleForBack',
        text: '退回'
      }, {
        fnName: 'handleForRelay',
        text: '转发'
      }, {
        fnName: 'handleForCallback',
        text: '召回'
      }, {
        fnName: 'handleForPublish',
        text: '申请关闭'
      } ]
      const { planStatus } = data;
      switch(planStatus) {
      case 'ALLOCATED':
        arr = [ btns[0], btns[1], btns[2] ];
        break;
      case 'ACCEPTED':
        arr = [ btns[1], btns[2], btns[4] ];
        break;
      case 'FEEDBACK':
        arr = [ btns[3] ];
      }
      this.taskInfomation.btns = arr;
      // console.log(btns,'1')
    },
    // 退回接口
    async reSubTask() {
      const { taskId } = this.$route.query,
        { name: routeName } = this.$route;
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/reSubTask', { id: taskId });
      if(+resultCode === 200 || resultCode.includes('200')) {
        this.taskId = '';
        this.showDialog = false;
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        })
        this.$router.push({
          name: routeName,
          query: {id: this.projectId}
        });
        this.getMyTaskList();
      }
    },
    // 发布（反馈）接口
    async feedbackSubTask() {
      const { taskId: id } = this.$route.query;
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/feedbackSubTask', { id, expireReason: this.overtime.reason });
      if(+resultCode === 200 || resultCode.includes('200')) {
        this.showDialog = false;
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.getSubTaskDetail(this.taskId);
      }
    },
    // 接受接口
    async acceptPlan() {
      const { taskId: id } = this.$route.query;
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/acceptPlan', { id })
      if(+resultCode === 200 || resultCode.includes('200')) {
        // this.getSubTaskDetail();
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.getMyTaskList();
        this.getSubTaskDetail(id);
      }
    },
    // 转发接口
    async forwardPlan() {
      const { taskId } = this.$route.query,
        { name: routeName } = this.$route,
        { dutyPersonNo, dutyPersonName } = this.relay;
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/forwardPlan', {
        id: taskId,
        dutyPersonNo,
        dutyPersonName
      })
      if(+resultCode === 200 || resultCode.includes('200')) {
        this.showDialog = false;
        this.taskId = '';
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.$router.push({
          name: routeName,
          query: { id: this.$route.query.id }
        })
        this.relay = {dutyPersonName: '', dutyPersonNo: ''};
        this.getMyTaskList();
        // this.getSubTaskDetail();
      }
    },
    // 召回接口
    async recallPlan() {
      const { taskId: id } = this.$route.query,
        { name: routeName } = this.$route;
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/recallPlan', { id })
      if(+resultCode === 200 || resultCode.includes('200')) {
        this.showDialog = false;
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        });
        this.$router.push({
          name: routeName,
          query: { id, taskId: this.taskId }
        })
        this.getSubTaskDetail(this.taskId);
      }
    },
    // 下载模板
    async downloadTemplate(row) {
      const { fileId } = row;
      if(!fileId) {
        this.$elTooltip({
          type: 'error',
          message: '请先上传交付件模板！'
        })
        return false;
      }
      const { data } = await this.$store.dispatch('ISDP/projectStart/wbs/downloadTemplate', {
        fileId
      })
      const {originFileName, docUrl } = data;

      const { data: result } = await this.$store.dispatch('common/download',{
        url: docUrl
      });
      this.$download(result, originFileName);
    },
    // 下载附件
    async downloadFile(row) {
      const { myFileId: fileId } = row;
      if(!fileId) {
        this.$elTooltip({
          type: 'error',
          message: '请先上传交付件'
        })
        return false;
      }
      const { data } = await this.$store.dispatch('ISDP/projectStart/wbs/downloadTemplate', {
        fileId
      })
      const {originFileName, docUrl } = data;

      const { data: result } = await this.$store.dispatch('common/download',{
        url: docUrl
      });
      this.$download(result, originFileName);
    },
    // 保存交付件上传
    async saveDeliverable(...args) {
      const { taskId } = this.$route.query;
      const { resultCode = '', resultMessage = '' } = await this.$store.dispatch('ISDP/projectStart/wbs/saveDeliverable', ...args);
      if(+resultCode === 200 || resultCode.includes()) {
        this.getSubTaskDetail(taskId);
        this.$elTooltip({
          type: 'success',
          message: resultMessage
        })
      }
    },
    beforeClose() {
      this.showDialog = false;
      this.$refs.relay.resetFields();
      this.overtime.reason = '';
      this.relay = {dutyPersonName: '', dutyPersonNo: ''};
      this.uplaodForm = { isMustFill: 1, fileName: '' }
    }
  },
  async created() {
    const { taskId } = this.$route.query;
    await this.getProjectMemberList();
    await this.getMyTaskList();
    if(taskId) {
      // console.log(1)
      this.taskId = taskId;
      this.getSubTaskDetail(taskId);
    }
  }
}
</script>

<style lang="less">
  .wbs-task {
    .flex {
      .child-task {
        width: 50%;
        flex-basis: 318px;
        max-width: 318px;
      }
      .right-content {
        min-width: 50%;
        margin-left: 27px;
        flex-grow: 1;
        .task-info {
          padding: 18px 43px 23px;
          background-color: #fff;
          .title {
            // height: 52px;
            line-height: 52px;
            font-size: 18px;
            font-weight: 600;
            color: #35425f;
          }
          .content {
            .flex {
              display: flex;
              flex-wrap: wrap;
              .con-item {
                &:last-child {
                  margin-right: 0;
                }
                display: inline-block;
                margin-right: 150px;
                line-height: 38px;
                font-size: 12px;
                color: #3a3b3d;
                .label {
                  font-size: 12px;
                  color: #8d9095;
                }
              }
            }
          }
        }
        .file-upload {
          margin-top: 22px;
          .file-upload-table {
            /deep/ .el-table {
              .el-table__fixed-right {
                margin-right: -8px;
              }
            }
          }
        }
      }
    }
    .el-dialog {
      .back {
        height: 170px;
        line-height: 170px;
        text-align: center;
        font-size: 14px;
        .el-icon {
          width: 18px;
          height: 18px;
          margin-right: 5px;
          font-size: 18px;
          color: #ffa200;
        }
      }
      .relay {
        height: 112px;
        padding-top: 28px;
        text-align: center;
        .relay-item {
          display: flex;
          height: 30px;
          line-height: 30px;
          margin-bottom: 16px;
          justify-content: center;
          > .label {
            color: #777a80;
          }
          .upload-box {
            width: 242px;
          }
          .el-form-item__error {
            margin-top: 5px;
          }
          .el-input {
            width: 214px;
            height: 30px;
            > .el-input__inner {
              height: 30px;
              line-height: 30px;
              border-radius: 0;
            }
          }
        }
      }
      .overtime {
        .overtime-item {
          justify-content: center;
          .label {
            width: 72px;
            line-height: 30px;
            font-size: 12px;
            color: #777a80;
          }
          .el-textarea-content {
            position: relative;
            .el-textarea {
              width: 327px;
              .el-textarea__inner {
                min-height: 158px;
                border-radius: 0;
              }
            }
            .count-position {
              position: absolute;
              right: 8px;
              bottom: 10px;
              font-size: 12px;
              color: #777a80;
            }
          }
        }
      }
    }
  }
</style>
