<template>
  <el-checkbox-group v-model.trim="form[options.prop]"
                     :disabled="disabled">
    <el-checkbox v-for="checkbox of checkboxOpts"
                 :label="checkbox.value"
                 v-model="checkbox.value"
                 :true-label="checkbox.trueLabel"
                 :false-label="checkbox.falseLabel"
                 :key="options.prop+(checkbox.name ||checkbox.label)">{{checkbox.label}}</el-checkbox>
  </el-checkbox-group>
</template>
<script>
export default {
  computed: {
    formItemOpts(){
      return this.options.formItemOpts || {};
    },
    checkboxOpts(){
      const { options,remoteData } = this,
        {formItemOpts = {} } = options;

      return remoteData[options.prop] || formItemOpts.checkbox || [];
    },
    disabled(){
      const {options,remoteData} = this;
      return this.$inputFlag(options,remoteData);
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
      type: Object,
      default(){
        return {}
      }
    }
  }
}
</script>
