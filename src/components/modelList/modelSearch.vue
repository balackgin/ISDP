<template>
  <el-form @submit.native.prevent="callback('submit',form)"
           size="small"
           :model="form"
           :inline="true"
           class="clearfix">
    <model-form-item v-for="formItem of options.formItems"
                     :key="formItem.prop"
                     :options="formItem"
                     :form="form"
                     :remoteData="remoteData"
                     class="float-left ml-1"
                     @callback="callback"></model-form-item>
    <div class="float-left ml-1">
      <el-button :type="btn.type"
                 v-for="btn of options.btns"
                 :key="btn.text"
                 @click="callback(btn.fnName || 'handleClickForSubmit',btn,form)"
                 size="small">{{btn.text}}</el-button>
    </div>
  </el-form>
</template>
<script>
import ModelFormItem from '../modelFormGroup/modelFormItem';
export default {
  components: {
    ModelFormItem
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    }
  },
  props: {
    options: {
      type: Object,
      required: true
    },
    form: {
      type: Object,
      required: true
    },
    remoteData: {
      type: Object
    }
  }
}
</script>
