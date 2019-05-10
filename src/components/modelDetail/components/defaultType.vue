<template>
  <div class="text col-txt"
       :class="[{'nISDP-col-txt': parentsOpts.theme === 'isdp'}]">
    <el-tooltip effect="dark"
                class="table-tooltip"
                placement="top"
                :content="Number.isNaN(contentValue) ? contentValue : contentValue+''">
      <span :style="[commonOpts.textStyle]">{{contentValue}}</span>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  props: {
    contentValue: {
      required: true
    },
    commonOpts: {
      type: Object,
      default(){
        return {}
      }
    },
    parentsOpts: {
      type: Object
    }
  }
}
</script>
<style lang="less" scoped>
  @hei: 32px;
  .col-txt {
    font-size: 16px;
    color: #333;
    height: @hei;
    line-height: @hei;
    // white-space: nowrap;
    overflow: hidden;
    text-overflow: clip;
    span {
      height: 100%;
      display: inline-block;
    }
    &.nISDP-col-txt {
      font-size: 14px;
    }
  }
</style>
