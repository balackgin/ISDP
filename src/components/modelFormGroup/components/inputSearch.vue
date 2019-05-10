<template>
  <el-tooltip placement="top"
              :content="form[options.prop] + ''"
              :value="currentTooltipProp === options.prop"
              :manual="true"
              effect="dark"
              @mouseenter.native="handleMouseenter(form,options,$event,true)"
              @mouseleave.native="currentTooltipProp = ''">
    <el-input v-model.trim="form[options.prop]"
              :placeholder="formItemOpts.placeholder"
              :readonly="readonly"
              :disabled="disabled"
              class="input-search-box"
              @focus="callback('handleFocusForInputSearch',form,options,$event)">
      <!-- slot: append || prepend -->
      <el-button :slot="formItemOpts.search.slot || 'append'"
                 v-if="formItemOpts.search"
                 :class="formItemOpts.search.class"
                 :icon="formItemOpts.search.icon">
        {{formItemOpts.search.icon ? '' : formItemOpts.search.text}}
      </el-button>
    </el-input>
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
      this.$isChangeWidth(...args);
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
