<template>
  <el-dialog :visible.sync="show"
             :width="options.width"
             :close-on-click-modal="false"
             :close-on-press-escape="false"
             :before-close="beforeClose"
             class="nISDP-inside-dialog-wrap"
             :class="options.className">

    <span class="dialog-title"
          slot="title">{{options.title}}</span>

    <slot name="content"></slot>

    <div class="inside-footer"
         slot="footer"
         v-if="options.btns || $slots.footer">
      <template v-if="options.btns">
        <template v-for="(btnItem,btnIdx) of options.btns">
          <el-button :key="btnIdx+''"
                     class="btn"
                     :type="btnItem.type"
                     :plain="btnItem.plain"
                     @click.prevent="callback(btnItem.fnName || 'btnCallback')">{{btnItem.text}}</el-button>
        </template>
      </template>
      <template v-else>
        <slot name="footer"></slot>
      </template>
    </div>
    <!-- <el-button plain
                   type="danger"
                   size="small">取消</el-button>
        <el-button type="danger"
                   size="small">确认</el-button> -->

  </el-dialog>
</template>
<script>
export default {
  methods: {
    callback(...args) {
      this.$callback(...args);
    },
    beforeClose() {
      this.callback('beforeClose');
    }
  },
  props: {
    show: {
      type: Boolean,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  }
};
// options
// {
//     "title": "test",
//     "width": "",
//     "btns": [
//       {
//         "text": "123",
//         "fnName": "testFnName"
//       },
//       {
//         "text": "234",
//         "type": "danger",
//         "fnName": "testFnName1"
//       }
//     ]
//   }
</script>

<style lang="less">
  .nISDP-inside-dialog-wrap {
    .el-dialog {
      top: 50%;
      width: 512px;
      max-width: 90%;
      margin-top: 0 !important;
      transform: translateY(-50%);
      .el-dialog__header {
        @hei: 44px;
        height: @hei;
        padding: 0 14px;
        border-radius: 2px;
        line-height: @hei;
        box-shadow: 0px 1px 10px 0px rgba(216, 213, 213, 0.5);
        .dialog-title {
          font-size: 14px;
          color: #333;
          font-weight: 600;
        }
        .el-dialog__headerbtn {
          top: 10px;
          right: 14px;
          .el-icon {
            font-size: 16px;
            color: #919090;
            font-weight: 600;
          }
        }
      }
      .el-dialog__body {
        // padding: 0;
        .tooltip-text {
          padding: 70px 0;
          font-size: 16px;
          text-align: center;
          color: #333;
        }
        .tooltip-img {
          margin-right: 4px;
          vertical-align: bottom;
        }
      }
      .el-dialog__footer {
        height: 58px;
        padding: 14px 14px 0;
        border-top: 1px solid #e3e3e3;
        .btn {
          & ~ .btn {
            margin-left: 12px;
          }
        }
      }
    }
  }
</style>
