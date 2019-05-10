<template>
  <el-form :rules="rules"
           :model="form"
           :ref="refEle"
           :label-width="formGroupOpts.labelWidth"
           :label-position="formGroupOpts.labelPosition"
           :size="formGroupOpts.size"
           :disabled="formGroupOpts.disabled"
           :show-message="formGroupOpts.showMessage"
           :inline="formGroupOpts.inline"
           @submit.native.prevent
           class="model-form-group-wrap model-form-group">
    <section v-for="(groupItem,groupIndex) of options.formGroup"
             :key="groupIndex+''">
      <!-- title start -->
      <p v-if="groupItem.title"
         class="form-title">{{groupItem.title}}</p>
      <!-- title end -->
      <el-row :gutter="groupItem.row && groupItem.row.gutter || formGroupOpts.row && formGroupOpts.row.gutter  || 0">
        <template v-for="item of groupItem.formItems">
          <model-col ref="modelCol"
                     :key="item.prop || item.label"
                     :options="item"
                     :parentOpts="formGroupOpts"
                     :form="form"
                     :remoteData="remoteData"
                     @callback="callback"></model-col>
        </template>
      </el-row>
    </section>
  </el-form>
</template>

<script>
import ModelCol from './modelCol';
export default {
  name: 'modelFormGroup',
  components: {
    ModelCol
  },
  computed: {
    formGroupOpts(){
      return this.options.formOpts || {}
    }
  },
  methods: {
    callback(...args){
      // const { options } = this;
      // // 寻找options 或者options.actions的方法 没有则给父组件
      // options[fnName] ? options[fnName](this,form,item,event) : options.actions && options.actions[fnName] && options.actions[fnName](this,form,item,event) || this.$emit('callback',fnName,form,item,event);
      this.$callback(...args);
    },
    getForm(){
      return this.$refs[this.refEle];
    },
    clearFiles(){
      this.$nextTick(function(){
        const modelColArr = this.$refs.modelCol || [];
        modelColArr.forEach((item) =>  {
          item.clearFiles && item.clearFiles();
        })
      });
    }
  },
  mounted () {
    this.callback('getForm',this.refEle,this.$refs[this.refEle]);
  },
  // beforeUpdate(){
  //   // resetFields   clearValidate
  //   this.$refs[this.refEle].resetFields();
  // },
  props: {
    options: {
      type: Object,
      required: true,
      default(){
        return {}
      }
    },
    form: {
      type: Object,
      required: true,
      default(){
        return {}
      }
    },
    rules: {
      type: Object,
      default(){
        return {}
      }
    },
    remoteData: {
      type: Object
    },
    refEle: {
      type: String,
      default: 'modelForm'
    }
  }
}
/*
  props.options
  {
    formOpts: {},
    formGroup: [{
      formGroupOpts: {},
      formItems: [{
        label: '',
        prop: '',
        type: '',
        formItemOpts: {}
      }]
    }]
  }
*/
</script>
<style lang="less">
  .model-form-group-wrap {
    .form-title {
      margin-bottom: 20px;
      padding: 6px 14px;
      background-color: #ddd;
      font-size: 14px;
      font-weight: 600;
      color: #333;
    }
  }
</style>
