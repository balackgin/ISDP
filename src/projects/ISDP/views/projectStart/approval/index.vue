<template>
  <div class="projectStart-approval-wrap">
    <inside-head :options="headConfig"
                 @callback="callback"></inside-head>
    <model-detail :options="detailConfig"
                  :data="detailData"></model-detail>

    <div class="approval-description"
         v-if="userinfo.username === detailData.projectManagerNo">
      <div class="approval-des-head clearfix">
        <span class="title">项目描述</span>
        <div class="float-right btns">
          <el-button v-if="descFlag"
                     class="btn-item edit"
                     icon="el-icon-edit-outline"
                     type="text"
                     @click="descFlag = false">编辑</el-button>
          <template v-else>
            <el-button class="btn-item cancel"
                       type="text"
                       @click="descCancel">取消</el-button>
            <el-button class="btn-item submit"
                       @click="descSubmit"
                       type="text">提交</el-button>
          </template>
        </div>
      </div>
      <div class="approval-input">
        <el-input v-model="descVal"
                  type="textarea"
                  resize="none"
                  :disabled="descFlag"
                  placeholder="请填写相关的项目描述"></el-input>
      </div>
    </div>
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
import modelDetail from '@/components/modelDetail';
import insideHead from '@ISDP/components/insideHead';
import headOpts from './config/head.config';
import detailConfig from './config/detail.config';
import { mapState } from 'vuex';
export default {
  components: {
    insideHead,
    modelDetail
  },
  data(){
    return {
      // headConfig,
      detailConfig,

      detailData: {},

      projectManager: false,
      projectId: this.$route.query.id,
      approvalUrl: '',
      isConfirmProjectModel: 0,

      descFlag: true,
      descVal: ''
    }
  },
  computed: {
    ...mapState({
      userinfo: (state) => state.common.userinfo || {},
      headConfig(state) {
        const menuData = state.ISDP.common.currentMenu || {},
          {btns = []} = menuData,
          {isConfirmProjectModel} = this,
          resultData = headOpts.toJson();
        resultData.btns = !isConfirmProjectModel ? resultData.btns.filter((item) => btns.includes(item.text) ) : [];
        return resultData;
      }
    })
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    // inside-head start
    async confirmProjectModel(){
      const {projectId: id} = this;
      if(id){
        const {resultCode,resultMessage} = await this.$store.dispatch('ISDP/projectStart/projectModelConfirm',{id});
        if(+resultCode === 200)  {
          this.$elTooltip({
            message: resultMessage,
            type: 'success'
          });
          this.getDetail();
        }
      }
    },
    async changeProjectModel(){
      const {projectId: id,detailData} = this,
        {projectModel} = detailData;
      if(id){
        await this.$store.dispatch('ISDP/projectStart/projectModelModifyApply',{
          id,
          projectModel: [ 'LARGE','L' ].includes(projectModel) ? 'SMALL' : 'LARGE',
          approvalForm: {
            approvalReason: ''
          }
        });
        this.getDetail();
      }
    },
    async getApprovalUrl(){
      const {projectId: id} = this;
      if(id){
        const {data} = await this.$store.dispatch('ISDP/projectStart/getApprovalUrl',{
          formType: 1,
          projectId: id
        });
        this.approvalUrl = data;
      }
    },
    // inside-head end
    async getDetail(){
      const {userinfo,projectId: id} = this;
      const {data = {}} = id && await this.$store.dispatch('ISDP/project/getProjectDetail',{id}) || {},
        {isConfirmProjectModel,projectManagerNo,projectDesc} = data;
        // isConfirmProjectModel 0/1/2
      const projectManager = userinfo.username  && userinfo.username === projectManagerNo;

      this.isConfirmProjectModel = +isConfirmProjectModel;
      this.projectManager = projectManager;
      this.detailData = data;
      this.descVal = projectDesc;
      isConfirmProjectModel && this.getApprovalUrl();
    },

    // 项目描述
    async descSubmit(){
      const {descVal,$store,projectId} = this;
      if(!projectId){
        return false;
      }
      const {resultCode} = await $store.dispatch('ISDP/projectStart/setProjectDesc',{
        id: projectId,
        projectDesc: descVal
      });
      if(+resultCode === 200){
        this.$elTooltip({
          message: '提交成功!',
          type: 'success'
        });
        this.descFlag = true;
        this.getDetail();
      }
    },
    descCancel(){
      this.descFlag = true;
      this.descVal = this.detailData.projectDesc || '';
    }
  },
  created(){
    this.getDetail();
  }
}
</script>
<style lang="less" scoped>
  .projectStart-approval-wrap {
    .approval-description {
      margin-top: 16px;
      padding: 24px 28px;
      background-color: #fff;
      .approval-des-head {
        .title {
          font-size: 15px;
          color: #666;
        }
        .btns {
          .btn-item {
            padding: 0;
            font-size: 14px;
            color: #777a80;
            &.cancel {
              color: #6c6c6c;
            }
            &.submit {
              height: 14px;
              padding-left: 14px;
              border-left: 1px solid #dcdcdc;
              line-height: 14px;
              color: #ff0000;
            }
          }
        }
      }
      .approval-input {
        margin-top: 22px;
        /deep/ .el-textarea__inner {
          height: 102px;
          border: 0;
          background-color: #f6f6f6;
          color: #656565;
          font-size: 14px;
          &::placeholder {
            color: #b8b8b8;
            font-size: 14px;
          }
        }
      }
    }
  }
</style>
