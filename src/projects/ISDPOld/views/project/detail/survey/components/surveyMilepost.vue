<template>
  <div class="milepost-wrap">
    <div class="manage-mask"
         v-if="!projectManager"></div>
    <div class="milepost-title detail-title-wrap">
      <span class="txt">里程碑</span>
    </div>
    <div class="milepost-list-box flex">
      <div class="item flex-item"
           v-for="(listItem,index) of list"
           :key="index+''">
        <ul class="list">
          <li :class="[item.status === 0 && '' || item.status === 3 && 'active over' || item.status === 2 && 'active']"
              v-for="(item, index) of listItem"
              :key="index"
              v-if="item.checked"
              @dblclick="changeMilestonName(item)">
            <i class="fa fa-check-circle complete-icon"></i>
            <i class="fa fa-clock prestart-icon"></i>
            {{item.milestoneNoteName}} {{item.actualEndDate && `（${item.actualEndDate}）${item.status === 3 ? '逾期': ''}`}}
          </li>
        </ul>
      </div>
    </div>
    <div class="milepost-list-box flex node-list-box">
      <div :class="['item flex-item', item.status === 0 && '' || item.status === 1 && 'process' || item.status === 2 && 'complete']"
           v-for="(item,index) of stageMap"
           :key="index">
        <i class="circle-icon"></i>
        <i class="process-line line1"></i>
        <i class="process-line line2"></i>
        <i class="process-line line3"></i>
        <time class="start-time time">开始: {{item.planStartDate}}</time>
        <i class="line"></i>
        <time class="end-time time">结束: {{item.planEndDate}}</time>
        <i class="model-btn">{{item.title}}</i>
      </div>
      <div class="item">
        <i class="circle-icon"></i>
        <i class="model-btn end-btn">完成</i>
      </div>
    </div>
    <outside-dialog :show="dialogShow"
                    :options="dialogOptions"
                    :form="form"
                    @callback="callback"></outside-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import outsideDialog from '@/components/outsideDialog';
export default {
  components: {
    outsideDialog
  },
  data() {
    return {
      dialogShow: false,
      list: [],
      stage: [],
      form: {
        date: ''
      },
      dialogOptions: {
        title: '里程碑节点时间',
        width: '400px',
        name: 'dialogOptions',
        titleCenter: true,
        type: 'form',
        group: [ {
          formItemConfig: [ {
            label: '实际结束时间:',
            type: 'date-picker',
            prop: 'date'
          } ]
        } ]
      }
    };
  },
  computed: {
    ...mapState({
      projectManager: (state) => state.ISDPOld.project.projectManager || ''
    }),
    milestoneList() {
      return this.list;
    },
    stageMap() {
      let stageMap = [
        {
          planStartDate: '',
          planEndDate: '',
          status: 0,
          title: '启动阶段'
        },
        {
          planStartDate: ' ',
          planEndDate: '',
          status: 0,
          title: '方案设计'
        },
        {
          planStartDate: '',
          planEndDate: '',
          status: 0,
          title: '项目实施'
        },
        {
          planStartDate: '',
          planEndDate: '',
          status: 0,
          title: '项目验收'
        }
      ];
      this.stage &&
        Object.keys(this.stage).map((item) => {
          stageMap[item].planStartDate = this.stage[item].planStartDate
          stageMap[item].planEndDate = this.stage[item].planEndDate
          stageMap[item].status = this.stage[item].status;
          // this.stageMap[item].planStartDate = val[item].planStartDate;
        });
      return stageMap;
    }
  },
  methods: {
    callback(fnName,...args){
      this[fnName] && this[fnName](...args);
    },
    outsideDialogSubmit(){
      const { date, id } = this.form;
      if(!date) {
        this.$elMessage({
          type: 'error',
          message: '请输入里程碑节点实际结束时间'
        })
        return false;
      }
      this.finishMilestoneNote({id, actualEndDate: date});
      // const { data, resultCode, resultMessage } = this.$store.dispatch('ISDP/project/finishMilestoneNote', {
      //   id,
      //   actualEndDate: date
      // })
    },
    async getMilestoneList() {
      let { data } = await this.$store.dispatch(
        'ISDPOld/project/getMilestoneList',
        {
          projectId: this.$route.query.id,
          isSurvey: true
        }
      );
      if (data) {
        // this.milestoneList = data;
        this.list = data.child;
        this.stage = data.parent;
      }
    },
    async finishMilestoneNote(params) {
      const { resultCode, resultMessage } = await this.$store.dispatch('ISDP/project/finishMilestoneNote', params);
      if(+resultCode === 200) {
        this.$elMessage({
          type: +resultCode === 200 ? 'success' : 'error',
          message: resultMessage
        })
        this.dialogShow = false;
        this.getDetail();
        this.getMilestoneList();
      }
    },
    beforeClose(){
      this.dialogShow = false;
    },
    getDetail(){
      this.$store.dispatch('ISDPOld/project/getProjectDetail',{
        id: this.$route.query.id
      });
    },
    changeMilestonName(opts) {
      this.dialogShow = true;
      this.form = Object.assign({
        id: opts.id,
        date: opts.actualEndDate
      });
      // this.$prompt('请输入实际结束时间', '里程碑节点时间', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消'
      // }).then(({ value }) => {
      //   console.log(value);
      // }).catch(() => {})
    }

  },
  created() {
    this.getMilestoneList();
  }
};
</script>


<style lang="less" scoped>
  .milepost-wrap {
    // margin-top: 24px;
    position: relative;
    .manage-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    .milepost-list-box {
      padding: 20px 30px 0;
      .item {
        padding: 6px 10px 30px;
        border-left: 1px dashed #ccc;
        .list {
          & > li {
            margin-bottom: 8px;
            color: #333;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            .fa {
              margin-right: 4px;
              font-size: 18px;
              vertical-align: middle;
            }
            .complete-icon {
              display: none;
              color: #469fcc;
            }
            .prestart-icon {
              color: #ccc;
              font-weight: 500;
            }
            &.active.over {
              color: red;
            }
            &.active {
              font-weight: 700;
              .prestart-icon {
                display: none;
              }
              .complete-icon {
                display: unset;
              }
            }
          }
        }
      }
    }
    // end of milepost-list-box
    .node-list-box {
      padding-top: 0;
      .item {
        position: relative;
        padding: 0;
        border-left: 0;
        white-space: nowrap;
        &:last-child {
          position: absolute;
          right: 0;
          bottom: 44px;
          .circle-icon {
            left: 55px;
            top: 7px;
          }
          > .model-btn {
            transform: translate(10%, 150%) !important;
          }
        }
        .process-line {
          position: absolute;
          display: none;
          top: 20px;
          left: 0;
          @wid: 20px;
          width: @wid*1.5;
          height: @wid / 4;
          transform: translateX(40%);
          background-color: #ef4d4d;
          &.line2 {
            top: 14px;
            left: 25px;
            width: @wid;
            transform: rotateZ(45deg);
          }
          &.line3 {
            top: 26px;
            left: 25px;
            width: @wid;
            transform: rotateZ(-45deg);
          }
        }
        .circle-icon {
          position: absolute;
          top: 11px;
          left: 0;
          @wid: 20px;
          width: @wid;
          height: @wid;
          border-radius: 50%;
          transform: translateX(-50%);
          background-color: #ddd;
          &::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            height: 200%;
            width: 4px;
            border-radius: 2px;
            transform: translate(-50%, -50%);
            background-color: #ddd;
            display: block;
          }
          &.end-icon {
            left: auto;
            right: 0;
            transform: translateX(50%);
          }
        }
        .time {
          @pad: 4px;
          padding: 0 14px @pad;
          display: block;
          color: #999;
          font-size: 12px;
          font-weight: 700;
          text-align: left;
          &.end-time {
            padding-top: @pad;
            text-align: right;
          }
        }
        .line {
          width: 100%;
          height: 4px;
          display: block;
          background-color: #eee;
        }
        .model-btn {
          position: relative;
          padding: 5px 25px;
          border: 1px solid #ddd;
          border-radius: 20px;
          margin-top: 16px;
          transform: translateX(-50%);
          display: inline-block;
          color: #666;
          font-size: 14px;
          font-weight: 700;
          &.end-btn {
            transform: translateX(50%);
          }
        }
        &:first-child {
          .model-btn {
            transform: translateX(-20%);
          }
        }

        @color: #ef4d4d;
        &.complete {
          .circle-icon {
            &,
            &::after {
              background-color: @color;
            }
          }
          .line {
            background-color: #ffa7a7;
          }
          .line1,
          .line2,
          .line3 {
            display: none;
          }
          .time {
            color: @color;
          }
          .model-btn {
            background-color: @color;
            color: #fff;
          }
        }
        &.process {
          .time {
            text-indent: 30px;
          }
          .process-line {
            height: 4px;
            display: block;
          }
          .circle-icon {
            @wid: 26px;
            width: @wid;
            height: @wid;
            border: 6px solid @color;
            margin-top: -2px;
            background-color: #fff;
            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              display: block;
              background-color: #fff;
              z-index: 1;
            }
            &::after {
              height: @wid * 2;
              background-color: @color;
              display: none;
            }
          }
          .start-time {
            color: @color;
          }
          .line {
            background: linear-gradient(to right, #ffa7a7, #eee);
          }
          .model-btn {
            background-color: @color;
            color: #fff;
          }
        }
        // &:first-child {
        //   .model-btn {
        //     background-color: #fff;
        //     color: #666;
        //   }
        // }
      }
    }
  }
</style>
