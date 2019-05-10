<template>
  <outside-dialog :show="show"
                  :options="Config"
                  :form="formData"
                  :remoteData="remoteData"
                  :rules="rules"
                  :title="currentData && currentData.id ? '修改' : '添加问题风险'"
                  @callback="callback"></outside-dialog>
</template>
<script>
import {mapState} from 'vuex';
import outsideDialog from '@/components/outsideDialog';
import Config from './config/whole.dialog';
const formData = Config.data;
export default {
  components: {
    outsideDialog
  },
  data(){
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
      },
      validateForDatePicker = (rule,value,callback) => {
        const { planStartDate,planEndDate } = this.formData,
          msgFn = (msg) => {
            this.$elMessage({
              message: msg,
              type: 'error'
            });
            callback(new Error(msg));
          }
        let startTime = new Date(planStartDate).getTime(),
          endTime = new Date(planEndDate).getTime();
        if(rule.field === 'planStartDate' && !startTime){
          msgFn('请填写计划开始时间!');
        }else if(rule.field === 'planEndDate' && !endTime){
          msgFn('请填写计划完成时间!');
        }else if(startTime > endTime){
          this.formData.planEndDate = '';
          msgFn('计划完成时间必须大于计划开始时间');
        }else{
          callback();
        }
      };
    return {
      Config,
      formData: JSON.parse(JSON.stringify(formData)),
      remoteData: {},
      refForm: null,
      rules: {
        importanceLevel: [ {
          required: true,
          validator: validateFn('请选择重要级别!')
        } ],
        happenDate: [ {
          required: true,
          validator: validateFn('请填写发生时间!')
        } ],
        submitPersonName: [ {
          required: true,
          validator: validateFn('请选择提交人!')
        } ],
        problemClassify: [ {
          required: true,
          validator: validateFn('请选择问题类型!')
        } ],
        status: [ {
          required: true,
          validator: validateFn('请选择当前状态!')
        } ],
        dutyPersonName: [ {
          required: true,
          validator: validateFn('请选择责任人!')
        } ],
        problemDesc: [ {
          required: true,
          validator: validateFn('请填写问题描述!')
        } ],
        planStartDate: [ {
          required: true,
          validator: validateForDatePicker,
          trigger: 'change'
        } ],
        planEndDate: [ {
          validator: validateForDatePicker,
          trigger: 'change',
          required: true
        } ],
        actualEndDate: [ {
          validator: (rule,value,callback) => {
            let startDate = this.formData.planStartDate;
            if(value && startDate){
              let date = new Date(value).getTime(),
                startTime = new Date(startDate).getTime();
              if(startTime > date){
                let msg = '实际完成时间必须大于计划开始时间!';
                this.$elMessage({
                  message: msg,
                  type: 'error'
                });
                callback(new Error(msg));
              }else{
                callback();
              }
            }else{
              callback();
            }
          }
        } ]
      }
    }
  },
  computed: {
    ...mapState({
      projectModel: (state) => state.ISDPOld.project.projectModel
    })
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args) || this.$callback(fnName,...args);
    },
    async getPerson(){
      let {data} = await this.$store.dispatch('ISDPOld/project/getTeamMember',{
        projectId: this.$route.query.id
      });
      if(data){
        const {projectModel} = this,
          result = [];
        data.forEach((item) => {
          if(projectModel === 'SMALL'){
            const { staffName = '',staffNo = '',deptName = ''} = item;
            staffName && staffNo && result.push({
              value: staffName + '$$' + (deptName || ''),
              label: staffName + ' ' + staffNo
            });
          }else{
            item.list.forEach((item) => {
              const { staffName = '',staffNo = '',deptName = ''} = item;
              staffName && staffNo && result.push({
                value: staffName + '$$' + (deptName || ''),
                label: staffName + ' ' + staffNo
              });
            });
          }
        });
        this.remoteData = Object.assign({},this.remoteData,{
          dutyPersonName: result,
          submitPersonName: result
        })
      }
    },
    getForm(comName,com){
      this.refForm = com;
    },
    async outsideDialogSubmit(){
      this.refForm.validate( async (valid) => {
        if(valid){
          const url = this.currentData && this.currentData.id ?  'ISDP/project/modifyRiskProblem' : 'ISDP/project/addRiskProblem',
            params = Object.assign({},this.currentData,this.formData,{
              projectId: this.$route.query.id
            });
          params.submitPersonName = params.submitPersonName.split('$$')[0];
          let dutyArr = params.dutyPersonName.split('$$');
          params.dutyPersonName = dutyArr[0];
          params.dutyDept =  dutyArr[1] || '';
          let {resultCode} = await this.$store.dispatch(url,params);
          if(+resultCode === 200){
            this.callback('updateList');
            this.$elMessage({
              message: '操作成功!',
              type: 'success'
            });
          }
        }
      })
    }
  },
  created () {
    this.getPerson();
  },
  watch: {
    show(bool){
      this.refForm && this.refForm.resetFields() && this.refForm.clearValidate();
      if(bool){
        const {currentData} = this;
        this.formData = Object.assign({},JSON.parse(JSON.stringify(formData)),currentData,{
          dutyPersonName: currentData.dutyPersonName && currentData.dutyDept &&  currentData.dutyPersonName + '$$' +  currentData.dutyDept || ''
        });
      }
    }
  },
  props: {
    show: {
      type: Boolean
    },
    currentData: {
      type: Object,
      default(){
        return {}
      }
    }
  }
}
</script>
