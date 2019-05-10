<template>
  <el-input type="number"
            :controls-position="formItemOpts.controlsPosition || 'right'"
            :readonly="readonly"
            :disabled="disabled"
            v-model.number="form[options.prop]"
            :placeholder="formItemOpts.placeholder">
  </el-input>
</template>
<script>
export default {
  computed: {
    formItemOpts(){
      return this.options.formItemOpts || {};
    },
    disabled(){
      const {options,remoteData} = this;
      return this.$inputFlag(options,remoteData);
    },
    readonly(){
      const {options,remoteData} = this;
      return this.$inputFlag(options,remoteData,'Readonly');
    }
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
      type: Object,
      default(){
        return {}
      }
    }
  }
}
</script>
