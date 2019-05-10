<template>
  <div class="project-projectDisclousure-component">
    <div class="mb-2">
      <el-button type="danger"
                 size="small"
                 v-if="+detailData.isDisclosure === 0"
                 @click="submit">发起交底流程</el-button>
    </div>
    <section class="ppc-group mb-2"
             v-for="item of disclosureData"
             :key="item.text">
      <p class="title line-text mb-1">
        <span class="text">{{item.text}}</span>
      </p>
      <model-table :options="tableConfig"
                   :data="item.data"
                   @callback="callback"></model-table>
    </section>

    <iframe :src="approvalUrl"
            v-if="approvalUrl"
            class="frame mt-2"
            name="approval"
            frameborder="0"></iframe>
    <el-button class="refreshBtn"
               v-show="false"
               @click="refreshFn"></el-button>
    <!-- <section class="ppc-group mb-2">
      <p class="title line-text mb-1">
        <span class="text">商务关系</span>
      </p>
      <model-table :options="Config.material"
                   :data="[]"></model-table>
    </section>
    <section class="ppc-group mb-2">
      <p class="title line-text mb-1">
        <span class="text">技术</span>
      </p>
      <model-table :options="Config.material"
                   :data="[]"></model-table>
    </section>
    <section class="ppc-group mb-2">
      <p class="title line-text mb-1">
        <span class="text">风险</span>
      </p>
      <model-table :options="Config.material"
                   :data="[]"></model-table>
    </section> -->
    <outside-dialog :show="dialogShow"
                    title="上传文件"
                    class="ppc-dialog"
                    @callback="callback">
      <el-upload action="/easywork/api/platform/file/project/upload"
                 class="d-inline-block"
                 :headers="{token}"
                 :data="{creator: userinfo.user}"
                 :multiple="false"
                 :show-file-list="false"
                 :auto-upload="true"
                 :on-success="onSuccess"
                 :on-error="onError">
        <el-button size="small"
                   type="primary">选择文件</el-button>
      </el-upload>
      ( 单个文件最大50M )

      <model-table class="mt-1 mb-1"
                   :options="Config.file"
                   :data="fileData"
                   @callback="callback"></model-table>
      <!-- <el-button size="small"
                 type="danger">开始上传</el-button> -->
      <section class="form-section mt-2">
        <p class="form-section-label">说明:</p>
        <el-input type="textarea"
                  class="mt-1"
                  v-model.trim="remake"></el-input>
      </section>
      <div slot="footer">
        <el-button size="small"
                   type="primary"
                   @click="handleClickForSubmit">确认</el-button>
        <el-button @click="beforeClose"
                   size="small">取消</el-button>
      </div>
    </outside-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import modelTable from '@/components/modelList/modelTable';
import outsideDialog from '@/components/outsideDialog';
import Config from './config/projectDisclousure.config'
export default {
  components: {
    modelTable,
    outsideDialog
  },
  computed: {
    ...mapState({
      disclosureData: (state) => state.ISDPOld.project.disclosureData || [],
      token: (state) => state.common.token,
      detailData: (state) => {   // isDisclosure 是否确认交底
        let detail = state.ISDPOld.project.detailData || {};
        return detail.data || {};
      },
      userinfo: (state) => state.common.userinfo || {},
      roleArr: (state) => state.ISDPOld.project.roleArr || []
    }),
    tableConfig(){
      const { userinfo,detailData} = this,
        result = Config.material;
      if(![ detailData.projectManagerNo,detailData.businessOwnerNo ].includes(userinfo.username)){
        result.columns.pop();
      }
      return result;
    }
  },
  data(){
    return {
      Config,
      dialogShow: false,
      currentObj: {},
      fileData: [],
      remake: '',
      approvalUrl: ''
    }
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    ppcEdit(data){
      const { detailData,userinfo } = this,
        bool = detailData.projectManagerNo !== userinfo.username && !data.status;

      this.currentObj = data;
      this.fileData = data.files.map((item) => {
        bool || +detailData.isDisclosure === 1 ? item.icons = [] : '';
        item.size = item.fileSize || item.size;
        return item;
      });
      this.remake = data.discription;
      this.dialogShow = true;
    },
    ppcRemove(data,itemObj){
      const { detailData,userinfo } = this;
      if(detailData.projectManagerNo !== userinfo.username && !itemObj.status){
        this.$elMessage({
          message: '没有操作权限!',
          type: 'error'
        });
        return false;
      }
      let index = this.fileData.findIndex((item) => item.id === itemObj.id);
      this.fileData.splice(index,1);
    },
    beforeClose(){
      this.dialogShow = false;
    },
    onSuccess(response,file){
      const { data,resultCode } = response;
      if(resultCode === 'FS200' || resultCode.includes('200')){
        this.$elMessage({
          message: '上传成功!',
          type: 'success'
        });
        this.fileData.push(Object.assign({},data,file,{
          size: (file.size / 1024).toFixed(2)
        }));
      }else{
        this.$elMessage({
          message: '上传失败',
          type: 'error'
        });
      }
    },
    onError(){
      this.$elMessage({
        message: '上传失败',
        type: 'error'
      });
    },
    async handleClickForSubmit(){
      const {fileData,remake,currentObj} = this;
      // if(!fileData.length){
      //   this.$elMessage({
      //     message: '请上传附件!',
      //     type: 'error'
      //   });
      //   return false;
      // }
      let { resultCode} = await this.$store.dispatch('ISDP/project/setProjectDisclosure',{
        id: currentObj.id,
        fileId: fileData.map((item)=>item.id).join(','),
        discription: remake,
        needSupport: 1,
        contractNo: this.detailData.contractNo,
        projectId: this.detailData.id
      });

      if(+resultCode === 200 || resultCode.includes('200')){
        this.$elMessage({
          message: '提交成功!',
          type: 'success'
        });
        this.beforeClose();
        // let {id = ''} = this.$route.query;
        // await this.$store.dispatch('ISDPOld/project/getProjectDisclosure',{id})
        this.getProjectDisclosure();
      }
    },
    async getProjectDisclosure(){ // 项目交底
      let {id = ''} = this.$route.query;
      await this.$store.dispatch('ISDPOld/project/getProjectDisclosure',{id})
    },
    async getApprovalUrl(){
      let { data } = await this.$store.dispatch('common/getApproval',{
        projectId: this.$route.query.id,
        formType: 4
      });
      this.approvalUrl = data;
    },
    async submit(){
      await this.$store.dispatch('ISDP/project/disclosureFileStart',{
        id: this.$route.query.id
      });
      this.getApprovalUrl();
    },
    refreshFn(){
      this.getProjectDisclosure();
      this.getApprovalUrl();
    }
  },
  created () {
    this.getProjectDisclosure();
    this.getApprovalUrl();
    // const messageCallback = () => {
    //   this.getProjectDisclosure();
    //   this.getApprovalUrl();
    //   window.removeEventListener('message',messageCallback);
    // }
    // window.addEventListener('message',messageCallback);
    // window.addEventListener('message',() => { // args
    //   // args.data; // child frame 的参数
    //   this.getProjectDisclosure();
    //   this.getApprovalUrl();
    // })
  }
}
</script>
<style lang="less">
  .project-projectDisclousure-component {
    .ppc-dialog {
      .dialog-wrap {
        width: 600px;
        max-width: 60%;
        .d-inline-block {
          display: inline-block;
        }
      }
    }
    .frame {
      width: 100%;
      height: 600px;
    }
  }
</style>
