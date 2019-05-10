<template>
  <div class="project-default-head-wrap">
    <div class="inside-box flex flex-wrap">
      <p class="flex-auto text">{{detailData.contractName}}</p>
      <div class="flex-auto icons-box">
        <el-button type="text"
                   class="icon-btn icon-star"
                   :class="{active: projectDefaultID && projectDefaultID === detailData.id}"
                   @click="saveProjectForDefault">
          <img class="is-normal"
               src="@ISDP/assets/images/common/common_btn_moren_n.png"
               alt="">
          <img class="is-hover"
               src="@ISDP/assets/images/common/common_btn_moren_h.png"
               alt="">
          <img class="is-active"
               src="@ISDP/assets/images/common/common_btn_moren_p.png"
               alt="">
          设为默认项目
        </el-button>
        <el-button type="text"
                   class="icon-btn"
                   @click="exportData">
          <img class="is-normal"
               src="@ISDP/assets/images/common/common_btn_daochu_n.png"
               alt="">
          <img class="is-hover"
               src="@ISDP/assets/images/common/common_btn_daochu_h.png"
               alt="">
          导出数据
        </el-button>
        <el-button type="text"
                   class="icon-btn"
                   @click="exportProjectReport">
          <img class="is-normal"
               src="@ISDP/assets/images/common/common_btn_daochu_n.png"
               alt="">
          <img class="is-hover"
               src="@ISDP/assets/images/common/common_btn_daochu_h.png"
               alt="">
          导出项目报告
        </el-button>
      </div>
    </div>
    <ul class="lists flex flex-wrap">
      <li class="flex-auto">
        <span class="label-text">负责人: </span>
        <span class="value-text">{{detailData.projectManagerName}}</span>
      </li>
      <li class="flex-auto">
        <span class="label-text">项目编号: </span>
        <span class="value-text">{{detailData.contractNo}}</span>
      </li>
      <li class="flex-auto">
        <span class="label-text">交付等级: </span>
        <span class="value-text">{{detailData.projectLevel}}</span>
      </li>
      <li class="flex-auto">
        <span class="label-text">交付阶段: </span>
        <span class="value-text">{{detailData.projectPhase}}</span>
      </li>
      <li class="flex-auto">
        <span class="label-text">交付状态: </span>
        <span class="value-text">{{detailData.projectStatus}}</span>
      </li>
      <li class="flex-auto">
        <span class="label-text">项目进度: </span>
        <span class="value-text">{{detailData.projectProgress || 0}}%</span>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  computed: {
    ...mapState({
      projectDefaultID: (state) => state.ISDP.project.projectDefaultID
    }),
    detailData(){
      return this.data || {};
    }
  },
  methods: {
    async saveProjectForDefault(){
      const {isDefault,id} = this.detailData;
      if(isDefault || !id){
        return false;
      }
      const  {resultCode} =  await this.$store.dispatch('ISDP/project/saveProjectForDefault',{
        businessId: id
      });
      if(resultCode && resultCode.includes('200')){
        this.$elTooltip({
          message: '操作成功!',
          type: 'success'
        });
      }
    },
    async exportProjectReport(){
      const {id,contractName} = this.detailData;
      if(!id){
        return false;
      }
      const {data} = await this.$store.dispatch('ISDP/project/exportProjectReport',{
        id
      });
      data && this.$download(data,`${ contractName }_项目报告.xlsx`);
    },
    async exportData(){
      const {id,contractName} = this.detailData;
      const {data} = id && await this.$store.dispatch('ISDP/project/exportProjectData',{
        id
      }) || {};

      data && this.$download(data,`${ contractName }_数据报告.xlsx`);
    }
  },
  props: {
    data: {
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
  .project-default-head-wrap {
    padding: 0.177083rem /* 34/192 */ 0.21875rem /* 42/192 */;
    background-color: #fff;
    .inside-box {
      @distance: 0.1875rem /* 36/192 */;
      .text {
        max-width: 100%;
        padding-right: @distance;
        font-size: 18px;
        color: #35425f;
        font-weight: 600;
      }
      .icons-box {
        position: relative;
        padding: 2px 0 0 @distance;
        vertical-align: middle;
        &::before {
          content: '';
          position: absolute;
          top: 6px;
          left: 0;
          width: 1px;
          height: 15px;
          display: block;
          background-color: #d7d7d7;
        }
        .icon-btn {
          padding: 0;
          color: #777a80;
          font-size: 14px;
          img {
            width: 16px;
            height: 16px;
            margin-right: 4px;
            vertical-align: sub;
            display: none;
            &.is-normal {
              display: inline-block;
            }
          }
          & ~ .icon-btn {
            margin-left: 0.255208rem /* 49/192 */;
          }
          &.icon-star {
            img {
              width: 18px;
              height: 18px;
            }
          }
          &:hover:not(.active),
          &:active:not(.active) {
            img {
              display: none;
              &.is-hover {
                display: inline-block;
              }
            }
          }
          &.active {
            img {
              display: none;
              &.is-active {
                display: inline-block;
              }
            }
          }
        }
      }
    }
    .lists {
      margin-top: 0.15625rem /* 30/192 */;
      .flex-auto {
        margin-right: 0.572917rem; /* 110/192 */
        // padding-right: 14px;
        white-space: nowrap;
        .label-text {
          color: #777a80;
          font-size: 14px;
        }
        .value-text {
          margin-left: 12px;
          color: #3a3b3d;
          font-size: 14px;
        }
      }
    }
  }
</style>
