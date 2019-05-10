<template>
  <div class="task-dialog-wrap">
    <outside-dialog :show="dialogShow"
                    title="项目任务反馈单"
                    @callback="callback">
      <model-detail :options="Config.dialogDetail"
                    :data="currentTask">
      </model-detail>
      <model-form-group :options="Config.dialogForm"
                        :form="formEdit"
                        :rules="rules"
                        @callback="callback">
      </model-form-group>
      <el-form @submit.native.prevent>
        <el-form-item label-width="120px"
                      label-position="right">
          <template slot="label">
            任务分解:
            <el-button class="button-add"
                       @click="addRowTask()">+</el-button>
          </template>
          <model-table :options="Config.dialogTable"
                       :remoteData="dialogRemoteData"
                       :data="tableData"
                       @callback="callback">
          </model-table>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button size="small"
                   type="primary"
                   @click="modifyTaskList">确 定</el-button>
        <el-button size="small"
                   @click="beforeClose">关 闭</el-button>
      </div>
    </outside-dialog>
  </div>
</template>
<script>
import modelFormGroup from '@/components/modelFormGroup';
import modelDetail from '@/components/modelDetail';
import modelTable from '@/components/modelList/modelTable';
import outsideDialog from '@/components/outsideDialog';
import Config from './config/task.dialog.json';
export default {
  components: {
    modelFormGroup,
    modelDetail,
    outsideDialog,
    modelTable
  },
  data(){
    const vm = this;
    function validateIsNull(msg){
      return (rule,value,callback) => {
        if(!value){
          vm.$elMessage({
            message: msg,
            type: 'error'
          });
          callback(new Error(msg));
        }else{
          callback();
        }
      }
    }
    return {
      Config,
      dialogShow: false,
      dialogRemoteData: {},
      currentTask: {},
      tableData: [],
      formTem: null,
      formEdit: {
        memo: '',
        feedbackAll: '',
        feedbackDate: '',
        feedbackProgress: ''
      },
      taskStatusOptions: [ {
        value: true,
        label: '是'
      },
      {
        value: false,
        label: '否'
      } ],
      rules: {
        feedbackProgress: [ {
          trigger: 'blur',
          required: true,
          validator: validateIsNull('请填写完成进度,0-100之间!')
        },{
          trigger: 'blur',
          validator: (rule,value,callback) => {
            if(+value < 0 || +value > 100 || Number.isNaN(+value)){
              vm.$elMessage({
                message: '请填写完成进度,0-100之间!',
                type: 'error'
              });
              callback(new Error('请填写完成进度,0-100之间!'));
            }else{
              callback();
            }
          }
        } ],
        feedbackAll: [ {
          trigger: 'blur',
          required: true,
          validator: validateIsNull('请填写任务完成内容!')
        } ]
      }
    }
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    handleCallback(...args){
      this.$callback(...args);
    },
    // 动态获取人员信息
    async handleChangeForSelect(val){
      let {data = []} = await this.$store.dispatch('ISDPOld/project/getEmplyees',{
        strKey: val
      });
      this.dialogRemoteData = Object.assign({},this.dialogRemoteData,{
        itemPerson: data && data.map((item)=>{
          item.FItemName = item.FItemName + ' ' + item.FItemNumber;
          return item;
        })
      });
      // this.personOptions = data;
    },
    beforeClose(){
      this.$emit('update:params',undefined);
      this.dialogShow = false;
    },
    taskFeedback(itemData = {}){
      const {id} = itemData;
      if(!id){
        return false;
      }
      this.currentTask = itemData;
      this.getQueryList(id);
    },
    // 获取任务单详情
    async getQueryList(args){  // 1
      const { data = {} } = await this.$store.dispatch('ISDPOld/project/getFeedbackDetail', {
        taskFormId: args
      });
      this.tableData = data.feedbackItemDTOList || [];
      this.formEdit = Object.assign({},{
        memo: '',
        feedbackAll: '',
        feedbackDate: this.currentTask.planEndDate,
        feedbackProgress: ''
      });
      this.dialogShow = true;
    },
    // // 增加操作
    addRowTask(){
      const addRows = {
        itemPerson: '',
        planDate: '',
        itemContent: '',
        itemStatus: '',
        id: ''
      };
      this.tableData.push(addRows);
    },
    // 删除操作
    handleClickForDialogRemove(data,row){
      let index = this.tableData.findIndex((item) => row === item);
      this.tableData.splice(index,1);
    },
    getForm(formName,vm){
      this.formTem = vm;
    },
    // 提交
    async modifyTaskList(){
      const { formEdit,tableData,currentTask,formTem } = this;
      formTem.validate(async (valid) => {
        if(valid){
          const {resultCode} = await this.$store.dispatch('ISDP/project/modifyTaskList', Object.assign({},formEdit,{
            feedbackItemDTOList: tableData,
            taskId: currentTask.id
          }));
          this.handleCallback('updateList');
          if(resultCode === 'TB200' || resultCode.includes('200')){
            this.$elMessage({
              message: '保存成功',
              type: 'success'
            });
            this.beforeClose();
          }
        }
      });

    },
    handleChangeForDatePicker(row,opts,val){
      const maxDate = new Date(this.formEdit.feedbackDate).getTime();
      if(val && maxDate){
        let date = new Date(val).getTime();
        if(date > maxDate){
          this.$elMessage({
            message: '该项计划完成时间必须小于反馈单的计划完成时间!',
            type: 'error'
          });
          row[opts.prop] = '';
        }
      }

    }
  },
  watch: {
    params(newVal){
      if(newVal){
        this.taskFeedback(newVal);
      }
    }
  },
  props: {
    params: {
      type: Object
    }
  }
}
</script>

<style lang="less" scoped>
  .task-dialog-wrap {
    .button-add {
      font-size: 24px;
      padding: 0;
      color: #d50000;
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      font-weight: 700;
      margin-left: 70px;
      &:hover {
        background-color: #ffc5c5;
      }
    }
  }
</style>
