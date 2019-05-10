<template>
  <div class="project-deafault-progress-wrap"
       v-if="milestoneData.length">
    <p class="title">{{options.title}}</p>
    <div class="progress-lists-box "
         v-if="resultObj.first">
      <div class="first-item action-item"
           :class="{success: resultObj.first.done,warning: resultObj.first.overDue}">
        <inside-tooltip :options="resultObj.first"></inside-tooltip>
        <p class="text">{{resultObj.first.milestoneName}}</p>
      </div>
      <ul class="progress-lists flex flex-item">
        <li class="flex-item action-item"
            :class="{success: item.done,warning: item.overDue}"
            v-for="(item,idx) of resultObj.group"
            :key="idx+''">
          <i class="icon-line"></i>
          <inside-tooltip :options="item"></inside-tooltip>
          <p class="text">{{item.milestoneName}}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import insideTooltip from './insideTooltip';
export default {
  components: {
    insideTooltip
  },
  data(){
    return {
      milestoneData: []
    }
  },
  computed: {
    resultObj(){
      const arr =  this.milestoneData || [],
        first = arr[0];
      arr.shift();
      return {
        first,
        group: arr
      }
    }
  },
  methods: {
    async getMilestoneList(){
      const projectId = this.$route.query.id;
      const {data} = projectId && await this.$store.dispatch('ISDP/common/getMilestoneList',{
        projectId
      }) || {};
      this.milestoneData = data || [];
    }
  },
  created(){
    this.getMilestoneList();
  },
  props: {
    options: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
  .project-deafault-progress-wrap {
    @bgColor: #d7d7d7;
    padding-bottom: 20px;
    .title {
      color: #333;
      font-size: 16px;
    }
    .progress-lists-box {
      position: relative;
      margin: 20px 20px 0;
      .text {
        white-space: nowrap;
        font-size: 14px;
        color: #3a3b3d;
      }
      // common
      /deep/ .action-item {
        position: relative;
        .icon-line {
          position: relative;
          width: 100%;
          height: 4px;
          margin-top: 4px;
          display: block;
          background-color: @bgColor;
        }
        .icon-circle {
          position: absolute;
          top: 0;
          right: 0;
          @wid: 12px;
          width: @wid;
          height: @wid;
          // border: 2px solid transparent;
          border-radius: 50%;
          display: block;
          background-color: @bgColor;
          z-index: 1;
          cursor: pointer;
        }
        .text {
          margin-top: 38px;
        }
        &.success {
          .icon-circle {
            background-color: #09cf5d;
          }
          .icon-line {
            background-color: #09cf5d;
          }
        }
        &.warning {
          .icon-circle {
            background-color: #f42020;
          }
          .icon-line {
            background-color: #f19797;
          }
        }
        &.success,
        &.warning {
          .icon-circle {
            @wid: 14px;
            width: @wid;
            height: @wid;
            top: -2px;
            border: 2px solid #fff;
          }
        }
      }
      .first-item {
        position: absolute;
        top: 0;
        left: 0;
        .icon-circle {
          left: 0;
          right: auto;
        }
      }
      .progress-lists {
        .flex-item {
          text-align: right;
          .text {
            position: relative;
            left: -5%;
            margin-top: 30px;
            transform: translateX(50%);
            display: inline-block;
          }
          &:last-child {
            .text {
              left: auto;
              transform: none;
            }
          }
        }
      }
    }
  }
</style>
