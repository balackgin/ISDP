<template>
  <el-dialog :visible="show"
             append-to-body
             :width="width || '60%'"
             class="inside-dialog"
             :before-close="beforeClose"
             :close-on-click-modal="false"
             :close-on-press-escape="false">
    <p slot="title">{{title}}</p>
    <slot></slot>
    <div slot="footer">
      <slot name="footer"></slot>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'insideDialog',
  data(){
    return {
      data: []
    }
  },
  methods: {
    beforeClose(){
      this.$emit('beforeClose');
    }
  },
  props: {
    show: {
      default: false,
      type: Boolean
    },
    title: {
      default: '',
      required: true,
      type: String
    },
    width: {
      default: '60%',
      type: String
    }
  }
}
</script>


<style lang="less">
  .inside-dialog {
    .el-dialog {
      // width: 64%;
      // margin-top: 4rem !important;
      position: absolute;
      top: 50%;
      right: 0;
      left: 0;
      margin: 0 auto !important;
      transform: translateY(-50%);
      border-radius: 6px;
      overflow: hidden;
      .el-form {
        .el-form-item__content {
          line-height: 1.5;
        }
      }
      .el-dialog__header {
        padding: 8px 14px;
        background-color: #ddd;
        font-size: 14px;
        .el-dialog__headerbtn {
          top: 10px;
        }
        .el-dialog__close {
          font-size: 20px;
          font-weight: 600;
          line-height: 1;
        }
      }
      .el-dialog__body {
        padding: 10px 14px;
        .el-form-item {
          margin-bottom: 0;
        }
      }
      .el-dialog__footer {
        padding: 0 14px 10px;
      }
    }
  }
</style>
