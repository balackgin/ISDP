<template>
  <el-tooltip placement="top"
              :content="form[options.prop] + ''"
              effect="dark"
              :manual="true"
              :value="currentTooltipProp === options.prop"
              @mouseenter.native="handleMouseenter(form,options,$event)"
              @mouseleave.native="currentTooltipProp = ''">
    <el-input v-model.trim="form[options.prop]"
              :class="{'modify-bg-color': readonly}"
              :type="formItemOpts.type"
              :rows="formItemOpts.rows"
              :resize="formItemOpts.resize"
              :autosize="formItemOpts.autosize"
              :placeholder="formItemOpts.placeholder"
              :size="formItemOpts.size"
              :readonly="readonly"
              :disabled="disabled"
              @keyup.native.enter="callback('handleKeyupForEnter',form,options,$event)"
              @focus="callback('handleFocus',form,options,$event)"
              @blur="callback('handleBlur',form,options,$event)"
              @change="callback('handleChange',form,options,$event)"></el-input>
  </el-tooltip>
</template>
<script>
export default {
  data(){
    return {
      currentTooltipProp: ''
    }
  },
  computed: {
    formItemOpts(){
      return this.options.formItemOpts || {};
    },
    readonly(){
      const {options,remoteData} = this;
      return this.$inputFlag(options,remoteData,'Readonly');
    },
    disabled(){
      const {options,remoteData} = this;
      return this.$inputFlag(options,remoteData);
    }
  },
  methods: {
    callback(...args){
      this.$callback(...args);
    },
    handleMouseenter(...args){
      this.$isChangeWidth(this,...args);
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
