<template>
  <div class="task-expand-wrap">
    <ul class="task-expand-list">
      <li v-for="item of data[options.id]"
          :key="item.id"
          @dblclick="handleDBLClickForExpandItem(item)">
        <time class="time">{{item.feedbackDate}}</time>
        <span class="ml-2 progress">{{item.feedbackProgress || 0}}%</span>
        <span class="text ml-2">{{item.feedbackAll}}</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'planTaskExpand',
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    handleDBLClickForExpandItem(opts){
      this.callback('handleDBLClickForExpandItem',opts);
    }
  },
  props: {
    options: {
      type: Object,
      default(){
        return {}
      }
    },
    data: {
      type: Object,
      default(){
        return {}
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .task-expand-wrap {
    .task-expand-list {
      width: 90%;
      margin: auto;
      text-align: left;
      li {
        padding: 4px 0;
        font-weight: 700;
        font-size: 14px;
        & ~ li {
          margin-top: 6px;
        }
        .time {
          color: #469fcc;
        }
        .progress {
          color: #fa6604;
        }
        .text {
          color: #333;
          font-weight: 500;
        }
      }
    }
  }
</style>
