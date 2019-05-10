<template>
  <el-tooltip placement="top"
              :content="form[options.prop] && form[options.prop].join(' - ') || ''"
              effect="dark"
              :manual="true"
              :value="currentTooltipProp === options.prop"
              @mouseenter.native="handleMouseenter(form,options,$event,true)"
              @mouseleave.native="currentTooltipProp = ''">
    <el-date-picker v-model.trim="form[options.prop]"
                    :placeholder="formItemOpts.placeholder"
                    type="daterange"
                    range-separator="至"
                    :start-placeholder="formItemOpts.startPlaceholder || ''"
                    :end-placeholder="formItemOpts.endPlaceholder || ''"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    :default-value="new Date()"
                    :disabled="disabled"
                    :picker-options="pickerOptsForDateRange"
                    @change="callback('handleChangeForDatePicker',form,options,$event)">
    </el-date-picker>
  </el-tooltip>
</template>

<script>
export default {
  data(){
    return {
      currentTooltipProp: '',
      pickerOptsForDateRange: {
        disabledDate(args){
          // 1971  2038
          const startTime = new Date('1971-01-01').getTime(),
            endTime = new Date('2038-1-1').getTime(),
            currentTime = new Date(args).getTime();

          return currentTime < startTime  || currentTime > endTime;
        }
      }
    }
  },
  computed: {
    formItemOpts(){
      return this.options.formItemOpts || {};
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
