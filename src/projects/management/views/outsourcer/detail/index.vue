<template>
  <div class="container management-outsourcer-detail">
    <a href="#"
       @click.prevent="handleClickForBack"
       class="fas back-icon fa-chevron-circle-left"></a>
    <section class="dod-group">
      <model-detail :options="detailConfig"
                    :fns="tableActions"
                    :form="form"
                    :remoteData="remoteData"
                    :data="detailData">
        <template slot="appendGroup">
          <div class="group table-group">
            <p class="table-caption">
              资质证书
            </p>
            <model-table class="dod-table"
                         :data="detailData.certificateArray"
                         :fns="tableActions"
                         :options="detailTableConfig.qualifications"></model-table>
          </div>
          <div class="group table-group">
            <p class="table-caption">
              主要人员详情
            </p>
            <model-table class="dod-table"
                         :data="detailData.staffArray"
                         :fns="tableActions"
                         :options="detailTableConfig.personnel"></model-table>
          </div>
          <div class="group table-group">
            <p class="table-caption">
              主要车辆详情
            </p>
            <model-table class="dod-table"
                         :data="detailData.vehicleArray"
                         :options="detailTableConfig.vehicle"></model-table>
          </div>
          <div class="table-group">
            <p class="table-caption">
              业绩详情
            </p>
            <model-table class="dod-table"
                         :data="detailData.achievementArray"
                         :options="detailTableConfig.achievement"></model-table>
          </div>
        </template>
      </model-detail>
    </section>
    <!-- <section class="dod-group approval-group">
      <el-form @submit.native.prevent
               label-position="right"
               :disabled="!+detailData.permission"
               label-width="100px"
               v-if="+detailData.permission">
        <el-form-item label="审批意见">
          <el-input type="textarea"
                    v-model.trim="idea"
                    :autosize="{minRows: 4,maxRows: 10}"></el-input>
          <div class="btns mt-1">
            <el-button size="small"
                       type="danger"
                       @click="submit(0)">通过</el-button>
            <el-button size="small"
                       @click="submit(1)">驳回</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div class="table-group">
        <p class="table-caption">审批记录</p>
        <model-table class="dod-table"
                     :data="approvalList"
                     :options="detailTableConfig.approval"></model-table>
      </div>
    </section> -->

    <section class="dod-group approval-group"
             v-if="approvalUrl">
      <iframe :src="approvalUrl"
              frameborder="0"
              class="frame"
              name="approval"></iframe>
    </section>
    <el-button class="refreshBtn"
               v-show="false"
               @click="refreshFn"></el-button>
  </div>
</template>
<script>
import {mapState} from 'vuex';
import modelDetail from '@/components/modelDetail'
import modelTable from '@/components/modelList/modelTable'
// import detailConfig from './config/detail.config';
// import detailTableConfig from './config/detail.table.config';
import detailConfig from '@/projects/outsourcer/views/baseinfo/config/config';
import detailTableConfig from '@/projects/outsourcer/views/baseinfo/config/detail';
export default {
  metaInfo: {
    title: '外包商详细信息'
  },
  components: {
    modelDetail,
    modelTable
  },
  computed: {
    ...mapState({
      sessionRoute: (state) => state.common.sessionRoute,
      selects: (state) => state.outsourcer.common.selects,
      userinfo: (state) => state.common.userinfo || {}
    })
  },
  data(){

    return {
      detailConfig,
      detailTableConfig,
      form: {...detailConfig.form},
      detailData: {},
      approvalList: [],
      idea: '',
      approvalNode: {},
      approvalUrl: '',
      remoteData: {},
      tableActions: {
        enterQualificationFn(options,item){
          return item.qualificationName + '<strong> ' + item.qualificationLevel + ' </strong>' +  (item.qualificationLevel && '级');
        },
        equipmentFn(options,item,idx){
          return (item.equipmentCount || idx === 0) ? item.equipmentType + '<strong> ' + item.equipmentCount + ' </strong>' + '台' : ' ';
        },
        vehicleFn(options,item){
          return item.vehicleType + '<strong> ' + item.count + ' </strong>' + '辆';
        },
        achievementFn(options,item){
          const year =  new Date(item.startDate).getFullYear();
          return '<strong>' + year + ' </strong>' + '年内完成同类业绩金额累积总计' + '<strong> ' + item.projectAmount + ' </strong>' + '万';
        },
        staffFn(options,item,idx){
          return (item.num || idx === 0) && item.text + '<strong> ' + item.num + ' </strong>人' || ' ';
        }
      }
    }
  },

  methods: {
    async getDetail(){
      const {id} = this.$route.query;
      if(!id){return false}
      let {data,resultCode} = await this.$store.dispatch('outsourcer/apply/getDetail',{
        id
      });
      this.getApprovalUrl();
      const { constructClassify, designClassify } = data;
      this.form = Object.assign({}, this.form, {constructClassify, designClassify});
      if (+resultCode === 200 && data) {
        // this.getApprovalList();
        this.tableActions.hideInput = () => +this.detailData.permission === 1
        const { countVO,equipmentArray,staffCount = {},vehicleArray } = data;
        let equipmentCountArr = JSON.parse(JSON.stringify(equipmentArray)),
          // staffCountArr = JSON.parse(JSON.stringify(staffCountVO)),
          vehicleCountArr = JSON.parse(JSON.stringify(vehicleArray));
        //设备情况 start
        equipmentCountArr = equipmentCountArr.map((item) => {
          item.listContent = item.equipmentCount && `${ item.equipmentType }<strong>${ item.equipmentCount }</strong>台` || '';
          return item;
        })
        equipmentCountArr.unshift({
          equipmentType: '设备总数量',
          equipmentCount: countVO.equipmentCount || 0,
          listContent: `设备总数量<strong>${ countVO.equipmentCount || 0 }</strong>台`
        });
        //设备情况 end
        // 人员情况 start
        // staffCountArr = Object.keys(staffCountArr).map((item) => ({
        //   text: item,
        //   num: staffCountArr[item] || 0
        // }));
        // staffCountArr.unshift({
        //   text: '在编总人数',
        //   num: countVO.staffCount || 0
        // });
        let personMatchCNObj = {
          dataManager: '资料员',
          // total: '在编总人数',
          techWorker: '技术员',
          engineerManager: '技术管理人员',
          proManager: '工程管理人员',
          designer: '设计人员',
          other: '其他'
        };
        //         其他
        // 工程部主管
        // 技术员
        // 技术部主管
        // 技术部经理
        // 资料员
        let staffCountArr = Object.keys(personMatchCNObj).map((item) => ({
          text: personMatchCNObj[item],
          num: staffCount && staffCount[item] || 0,
          listContent: staffCount && staffCount[item] && `${ personMatchCNObj[item] }<strong>${ staffCount && staffCount[item] || 0 }</strong>人` || ''
        }));
        staffCountArr.unshift({
          text: '在编总人数',
          num: staffCount && staffCount.total || 0,
          listContent: `在编总人数<strong>${ staffCount && staffCount.total || 0 }</strong>人`
        });
        // 人员情况 end
        // 车辆情况 start
        vehicleCountArr = vehicleCountArr.map((item) => {
          item.listContent = item.count && `${ item.vehicleType }<strong>${ (item.count || 0) }</strong>辆` || '';
          return item;
        });
        vehicleCountArr.unshift({
          vehicleType: '车辆总数量',
          count: countVO.vehicleCount || 0,
          listContent: `车辆总数量<strong>${ countVO.vehicleCount || 0 }</strong>辆`
        });
        // 车辆情况 end
        // 业绩情况  start
        data.achievementArray = data.achievementArray.map((item) => {
          item.cycle = item.startDate + ' ~ ' + item.endDate;
          let startDate = new Date(item.startDate).getFullYear();
          item.listContent = `<strong>${ startDate }</strong>年内完成同类业绩金额累积总计<strong>${ item.projectAmount }</strong>万`;
          return item;
        });
        // 业绩情况  end
        this.detailData = Object.assign({},data,{
          equipmentCountArr,
          staffCountArr,
          vehicleCountArr
        });
      }
    },
    async getApprovalList(){
      const {id} = this.$route.query;
      if(!id){return  false}
      let {data,resultCode} = await this.$store.dispatch('management/outsourcer/getApprovalList',{
        contractorId: id
      });
      if(data && +resultCode === 200){
        data = data.map((item,idx)=>{
          let nextName = data[idx - 1] && data[idx - 1].currentStep;
          nextName = nextName === '创建'  ? '' : nextName ;
          item.lastNodeName = idx  &&  nextName || ''
          return item;
        });
        this.approvalList = data;
        this.approvalNode = data[0];
        this.form.constructClassify ? '' :  this.form.constructClassify = this.detailData.constructClassify;
        this.form.designClassify ? '' :  this.form.designClassify = this.detailData.designClassify;
        // this.tableActions.hideInput = () => {
        //   console.log(+this.detailData.permission === 1,'+this.detailData.permission === 1;');
        //   return +this.detailData.permission === 1;
        // }
        // let { isFinal,status } =  this.approvalNode || {};
        // return +isFinal ? status !== '审批完成' : false;

      }
    },
    async submit(num){
      const { idea,approvalNode }  = this,
        {id} = this.$route.query;
      if(!id){return false}
      if(num){
        if(!idea){
          this.$elMessage({
            message: '请输入审批意见!',
            type: 'error'
          });
          return false;
        }
      }else{
        if(+approvalNode.isFinal && !this.form.constructClassify){
          this.$elMessage({
            message: '请填写认证类型!',
            type: 'error'
          });
          return false;
        }else if(+approvalNode.isFinal && !this.form.designClassify){
          this.$elMessage({
            message: '请选择认证级别!',
            type: 'error'
          });
          return false;
        }
      }

      const { nickname,username} = this.userinfo || {},
        params = Object.assign({},{
          contractorId: id,
          idea,
          result: num,
          approvalId: approvalNode.id,
          lastNode: approvalNode.lastNodeId,
          serialNo: approvalNode.serialNo,
          version: approvalNode.version,
          currentStep: approvalNode.currentStep,
          nodeHandlerName: nickname + ' (' + username + ')'
        },this.form);
      let  {resultCode} = await this.$store.dispatch('management/outsourcer/approvalConfirm',params);
      if(+resultCode === 200){
        this.idea = '';
        // this.getApprovalList();
        this.getDetail();
        this.$elMessage({
          message: '提交成功!',
          type: 'success'
        });
      }
    },
    handleClickForBack(){
      const { detailData } = this;
      let routeName = '';
      routeName = detailData.approvalStatus === '审批完成' && 'managementOutsourcerLibrary' || 'managementOutsourcerApply';
      this.$router.push({
        name: routeName,
        params: {
          type: 'back'
        }
      });
    },
    async getApprovalUrl(){
      let { data } = await this.$store.dispatch('management/outsourcer/getApprovalUrl',{
        contractorId: this.$route.query.id
      });
      this.approvalUrl = data;
    },
    async refreshFn(){
      const { constructClassify, designClassify} = this.form || {},
        { permission } = this.detailData;
      if(+permission === 1){
        // await this.getDetail();
        // const {approvalStatus} = this.detailData || {};
        // if(approvalStatus === '审批完成'){
        await this.$store.dispatch('management/outsourcer/approvalFinish',{
          contractorId: this.$route.query.id,
          constructClassify,
          designClassify
        });
      }

      this.getDetail();

    }
  },
  created () {
    this.getDetail();
    // console.log(this.$store,'test form');
  }
}
</script>
<style lang="less" scoped>
  .management-outsourcer-detail {
    .back-icon {
      margin-top: 20px;
      font-size: 20px;
      & + .dod-group {
        margin-top: 0;
      }
    }
    .dod-group {
      margin: 20px auto;
      padding: 30px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: #fff;
      .table-group {
        margin-top: 20px;
        .dod-table {
          margin: 14px 0 20px;
        }
      }
    }
    .frame {
      width: 100%;
      height: 600px;
    }
  }
</style>
