<template>
  <div class="projet-approval-component">
    <div class="btns"
         v-if="projectManager && +detailData.isConfirmProjectModel === 0">
      <el-button type="danger"
                 size="small"
                 @click="handleClickForModelConfirm">
        {{projectManagerSuperior ? '同意变更项目模式' :'确认项目模式'}}
      </el-button>
      <el-button type="danger"
                 size="small"
                 class="ml-1"
                 @click="handleClickForModelChange(0)">
        {{projectManagerSuperior ? '拒绝变更项目模式' : '变更项目模式'}}
      </el-button>
    </div>
    <!-- <div class="btns"
         v-if="projectManagerSuperior">
      <el-button type="danger"
                 size="small"
                 @click="handleClickForModelChange">{{ approvalList[0] && approvalList[0].status }}</el-button>
      <el-button type="danger"
                 size="small"
                 class="ml-1"
                 @click="handleClickForModelChange(0)">拒绝变更项目申请</el-button>
    </div> -->
    <section class="project-model-change-group"
             v-if="showModel">
      <div class="pmc-box">
        <model-form-group :options="formConfig"
                          class="form-group"
                          :form="formData">
        </model-form-group>
        <el-button type="danger"
                   size="small"
                   class="pmc-btn"
                   @click="handleClickForModelSubmit">提交</el-button>
      </div>
    </section>
    <model-detail :options="Config.detail"
                  :data="detailData"></model-detail>
    <!-- <div class="project-approval-list"
         v-if="approvalList.length">
      <model-table :options="Config.approvalList"
                   :data="approvalList"></model-table>
    </div> -->
    <input type="hidden"
           id="FID" />
    <iframe :src="approvalUrl"
            class="frame"
            name="approval"
            frameborder="0"
            v-if="approvalUrl"></iframe>
    <el-button class="refreshBtn"
               v-show="false"
               @click="getDetail"></el-button>
  </div>
</template>
<script>
import {mapState} from 'vuex';
import modelDetail from '@/components/modelDetail';
import modelTable from '@/components/modelList/modelTable';
import Config from './config/projectApproval.config';
const modelFormGroup = () => import('@/components/modelFormGroup');
export default {
  components: {
    modelDetail,
    modelFormGroup,
    modelTable
  },
  computed: {
    ...mapState({
      detailData: (state) => {
        let detail = state.ISDPOld.project.detailData || {};
        return detail.data || {};
      },
      userinfo: (state) => state.common.userinfo || {},
      approvalList: (state) =>state.ISDPOld.project.approvalListForContract || [],
      projectManager: (state) => state.ISDPOld.project.projectManager || '',
      projectManagerSuperior: (state) => state.ISDPOld.project.projectManagerSuperior || ''
    })
  },
  data(){
    return {
      Config,
      formData: {},
      showModel: false,
      approvalUrl: '',
      formConfig: {
        formOpts: {
          labelWidth: '140px',
          labelPosition: 'right',
          showMessage: false
        },
        formGroup: [ {
          formItems: [ {
            label: '原交付模式:',
            prop: 'projectModelText',
            type: 'text'
          }, {
            label: '变更后交付模式:',
            prop: 'projectModelAfterText',
            type: 'text'
          },{
            label: '变更原因:',
            prop: 'reason',
            required: true,
            formItemOpts: {
              type: 'textarea'
            }
          } ]
        } ]
      }
    }
  },
  methods: {
    async handleClickForModelConfirm(){
      const {id} = this.$route.query,
        { approvalList,detailData,userinfo } = this,
        approvalLastItem = approvalList[0] || {};
      if(approvalLastItem.workflowNo === userinfo.username  && +detailData.isConfirmProjectModel === 1){ //项目经理上级
        this.handleClickForModelChange(1);
        return false;
      }
      this.showModel = false;
      this.$elMsgBox({
        confirm: true,
        title: '确认交付模式',
        message: '是否确认按当前交付模式进行项目交付？',
        confirmButtonText: '是',
        cancelButtonText: '否',
        callback: async (action) => {
          if(action === 'confirm'){
            let {resultCode} = id && await this.$store.dispatch('ISDP/project/projectModelConfirm',{
              id
            }) || {};
            if(+resultCode === 200 || resultCode.includes('200')){
              this.$elMessage({
                message: '操作成功!',
                type: 'success'
              });
              this.getDetail();
              this.getProjectDisclosure();
            }
          }
        }
      })
    },
    handleClickForModelChange(num){
      let obj =  {
          LARGE: '大项目',
          SMALL: '小项目'
        },
        projectModel = this.detailData.projectModel,
        modelVal =  projectModel === 'LARGE' ? 'SMALL' : 'LARGE';
      let formObj = Object.assign({},{
        projectModelText: obj[projectModel],
        projectModelAfter: modelVal,
        projectModelAfterText: obj[modelVal],
        reason: ''
      });

      if(+this.detailData.isConfirmProjectModel === 1){  //项目经理上级
        let formItems = this.formConfig.formGroup[0].formItems;

        if(!num){  //拒绝变更项目模式
          formItems[1].label = '拒绝后交付模式:';
          formItems[2].required = true;
          formObj = Object.assign({},formObj,{
            projectModelAfterText: obj[projectModel]
          });
        }else{  //  同意变更项目模式
          formItems[1].label = '变更后交付模式:';
          formItems[2].required = false;
        }
        formItems[2].label = '意见:';
        this.showModel = this.status !== num ? true :  !this.showModel;
      }else{
        this.showModel =  !this.showModel;
      }
      this.formData = formObj;
      this.status = num;
    },
    async handleClickForModelSubmit(){
      const { formData,$route,approvalList,detailData,status,projectManagerSuperior } = this,
        approvalLastItem = approvalList[0] || {};
      if(projectManagerSuperior && +detailData.isConfirmProjectModel === 1){ //项目经理上级
        if(!status && !formData.reason){
          this.$elMessage({
            message: '请输入意见!',
            type: 'error'
          });
          return false;
        }
        let {resultCode} = await this.$store.dispatch('ISDP/project/projectApproval',Object.assign({},approvalLastItem,{
          formType: 1,
          result: status,
          projectId: $route.query.id,
          applicantNo: detailData.projectManagerNo,
          idea: formData.reason
        }));
        if(+resultCode === 200 || resultCode && resultCode.includes('200')){
          this.showModel = false;
          this.getDetail();
          this.getProjectDisclosure();
        }
        return false;
      }

      if(!formData.reason){
        this.$elMessage({
          message: '请输入变更原因!',
          type: 'error'
        });
        return false;
      }

      let {resultCode} = await this.$store.dispatch('ISDP/project/projectModelChange',{
        approvalForm: {
          approvalReason: formData.reason
        },
        projectModel: formData.projectModelAfter,
        id: $route.query.id
      });

      if(+resultCode === 200 || resultCode && resultCode.includes('200')){
        this.showModel = false;
        this.$elMessage({
          message: '操作成功,请点击下方通过按钮!',
          type: 'success'
        });
        this.getDetail();
      }
    },
    getDetail(){
      this.$store.dispatch('ISDPOld/project/getProjectDetail',{
        id: this.$route.query.id
      });
      // this.getApprovalList();
      this.getApproval();
    },
    async getApprovalList(){
      const { id } = this.$route.query;
      if(!id){
        return false;
      }
      await this.$store.dispatch('ISDPOld/project/getApprovalListForContract',{projectId: id,formType: 1});
    },
    async getProjectDisclosure(){ // 项目交底
      let {id = ''} = this.$route.query;
      await this.$store.dispatch('ISDPOld/project/getProjectDisclosure',{id})
    },
    async getApproval(){
      let {data} = await this.$store.dispatch('common/getApproval',{
        projectId: this.$route.query.id,
        formType: 1
      });
      this.approvalUrl = data;
    }
  },
  created () {
    +this.detailData.isConfirmProjectModel !== 0 && this.getApproval();
    // this.getApprovalList();
    // const messageCallback = () => {
    //   this.getDetail();
    //   window.removeEventListener('message',messageCallback);
    // }
    // window.addEventListener('message',messageCallback);
    // window.addEventListener('message',() => {  // args
    //   // args.data; // child frame 的参数
    //   this.getDetail();
    // })
  }
}
</script>
<style lang="less" scoped>
  .projet-approval-component {
    .project-model-change-group {
      padding: 0 40px;
      margin: 10px auto;
      .pmc-box {
        padding: 10px 16px;
        border-top: 1px solid #ddd;
        border-bottom: 1px solid #ddd;
        .pmc-btn {
          margin-left: 140px;
        }
      }
    }
    .frame {
      width: 100%;
      height: 600px;
    }
  }
</style>
