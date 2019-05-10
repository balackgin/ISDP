<template>
  <div class="outsode-dialog">

    <el-dialog :visible="show"
               :width="width || options.width || '80%'"
               custom-class="dialog-wrap"
               :close-on-click-modal="false"
               :modal="false"
               :center="options.center"
               :before-close="beforeClose">
      <!-- :before-close="callback()" //error: 会直接触发函数 -->
      <template slot="title">
        <p :class="{'text-center': options.titleCenter}">{{title || options.title}}</p>
      </template>
      <template v-if="options.type === 'form'">
        <model-form-group ref="formGroup"
                          :options="options"
                          :remoteData="remoteData"
                          :refEle="refEle"
                          :form="form"
                          :rules="rules"
                          @callback="callback"></model-form-group>
        <template slot="footer">
          <el-button @click.prevent="beforeClose"
                     size="small">{{options.cancel || '取消'}}</el-button>
          <el-button size="small"
                     @click="submit"
                     type="danger">{{options.submit || '确认'}}</el-button>

        </template>
      </template>
      <template v-else>
        <slot name="footer"
              slot="footer"></slot>
      </template>
      <slot></slot>
    </el-dialog>
  </div>
</template>
<script>
let ModelFormGroup = () => import('@/components/modelFormGroup');
export default {
  name: 'outsideDialog',
  components: {
    ModelFormGroup
  },
  methods: {
    callback(...args){
      // this.$emit('callback',fnName,args,obj,event);
      this.$callback(...args);
    },
    beforeClose(){
      this.clearFiles();
      this.callback('beforeClose');
    },
    submit(){
      this.callback('outsideDialogSubmit',this._data);
    },
    getFormVM(){
      return this.$refs.formGroup;
    },
    async getForm(){
      let formVM = '';
      await this.$nextTick(function(){
        formVM = this.$refs.formGroup.getForm();
      });
      return formVM;
    },

    async clearFiles(){
      await this.$nextTick(function(){
        this.$refs.formGroup.clearFiles();
      });
    }
  },
  props: {
    options: {
      type: Object,
      default(){
        return {}
      }
    },
    form: {
      type: Object,
      default(){
        return {}
      }
    },
    rules: {
      type: Object
    },
    title: {
      type: String
    },
    width: true,
    show: {
      type: Boolean,
      required: true,
      default: false
    },
    remoteData: {
      type: Object
    },
    refEle: {
      type: String
    }
  }
}
</script>

<style lang="less">
  .outsode-dialog {
    .el-dialog__wrapper {
      background-color: rgba(0, 0, 0, 0.7);
    }
    .dialog-wrap {
      margin-top: 0 !important;
      position: absolute;
      top: 50%;
      right: 0;
      left: 0;
      transform: translateY(-50%);
      margin: auto;
      .el-dialog__header,
      .el-dialog__footer {
        padding: 11px 14px;
        border-bottom: 1px solid #eee;
        background-color: #f8f8f8;
        color: #333;
        font-size: 16px;
        .el-dialog__headerbtn {
          top: 9px;
          right: 14px;
          font-weight: 600;
          font-size: 20px;
        }
      }
      .el-dialog__body {
        border-radius: 6px;
        background-color: #fff;
      }
    }
  }
</style>
