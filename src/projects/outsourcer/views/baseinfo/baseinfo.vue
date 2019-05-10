<template>
  <div class="home-wrap">
    <div class="right-box">
      <span class="text">{{detailData.approvalStatus}}</span>
      <el-button type="danger"
                 class="ml-2"
                 size="small"
                 v-if="!detailData.id || detailData.statusSign && ['notCommit','notPass'].includes(detailData.statusSign)"
                 @click="showModifyPopup = true">修改</el-button>
    </div>
    <model-detail :data="detailData"
                  :fns="tableActions"
                  :options="detailConfig"></model-detail>
    <div class="home-popup-wrap"
         v-if="showModifyPopup">
      <div class="home-popup-box">
        <i class="fa fa-times off-btn"
           @click="hidePopup"></i>
        <apply-tem @callback="callback"
                   :options="{isFrame: true,title: '外包工程商基本信息'}"></apply-tem>
      </div>
    </div>
  </div>
</template>
<script>
import modelDetail from '@/components/modelDetail';
// import detailData from './config/data';
import detailConfig from './config/config';
import { mapState } from 'vuex';
import applyTem from '@/projects/outsourcer/views/apply';
export default {
  components: {
    modelDetail,
    applyTem
  },
  metaInfo: {
    title: '外包工程商基本信息'
  },
  data(){
    return {
      detailConfig,
      showModifyPopup: false,
      tableActions: {
        enterQualificationFn(options,item){
          return item.qualificationName + '<strong> ' + item.qualificationLevel + ' </strong>' +  (item.qualificationLevel && '级');
        },
        equipmentFn(options,item,idx){
          return (item.equipmentCount || idx === 0) ? item.equipmentType + '<strong> ' + item.equipmentCount + ' </strong>台' : ' ';
        },
        vehicleFn(options,item){
          return item.vehicleType + '<strong> ' + item.count + ' </strong>辆';
        },
        achievementFn(options,item){
          const year =  new Date(item.startDate).getFullYear();
          return '<strong>' + year + ' </strong>年内完成同类业绩金额累积总计<strong> ' + item.projectAmount + ' </strong>万';
        },
        staffFn(options,item,idx){
          return (item.num || idx === 0) && item.text + '<strong> ' + item.num + ' </strong>人' || ' ';
        }
      }
    }
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    hidePopup(){
      this.getDetail();
      this.showModifyPopup = false;
    },
    async getDetail(){
      const { id } = this.outsourcerInfo;
      if (!id) {
        await this.$store.commit('outsourcer/apply/SET_DETAIL',Object.assign({}));
        return false;
      }
      await this.$store.dispatch('outsourcer/apply/getDetailForBaseinfo',{
        id
      });
    }
  },
  computed: {
    ...mapState({
      outsourcerInfo: (state) => state.outsourcer.common.outsourcerInfo || {},
      detailData: (state)=>state.outsourcer.apply.detailData || {}
    })
  }
}
</script>
<style lang="less" scoped>
  .home-wrap {
    position: relative;
    .right-box {
      position: absolute;
      right: 14px;
      top: 10px;
      z-index: 1;
      .text {
        color: #d50000;
        font-weight: 600;
        font-size: 14px;
      }
    }
    .home-popup-wrap {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 100;
      background-color: rgba(0, 0, 0, 0.5);
      .home-popup-box {
        position: relative;
        height: 100%;
        padding: 80px 150px 0;
        .off-btn {
          position: absolute;
          top: 66px;
          right: 140px;
          @hei: 32px;
          width: @hei;
          height: @hei;
          line-height: @hei;
          border-radius: 50%;
          text-align: center;
          font-size: 20px;
          color: #fff;
          cursor: pointer;
          z-index: 111;
          background-color: #999;
          &:hover {
            background-color: #d50000;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .home-wrap {
    .home-popup-wrap {
      .home-popup-box {
        .outsourced-entry-wrap {
          background: none;
          .entry-aside {
            display: none;
          }
          .entry-main {
            // padding-top: 60px;
            // padding-left: 150px;
            padding: 0;
            .title-box {
              display: none;
            }
          }
        }
      }
    }
  }
</style>
