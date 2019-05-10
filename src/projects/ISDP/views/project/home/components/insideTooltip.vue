<template>
  <el-tooltip effect="dark"
              placement="top"
              popper-class="progress-wrap-time">
    <template slot="content">
      <time class="time">计划完成时间: {{options.planEndDate}}</time>
      <time v-if="options.actualEndDate"
            class="time">实际完成时间: {{options.actualEndDate}}</time>
    </template>
    <i class="icon-circle"></i>
  </el-tooltip>
</template>
<script>
export default {
  props: {
    options: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less">
  .progress-wrap-time {
    .time {
      font-size: 12px;
      & ~ .time {
        margin-top: 6px;
        display: block;
      }
    }
  }
</style>
