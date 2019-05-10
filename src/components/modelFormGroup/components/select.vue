<template>
  <el-select v-model.trim="form[options.prop]"
             :size="formItemOpts.size"
             :filterable="formItemOpts.filterable"
             :multiple="formItemOpts.multiple"
             :collapse-tags="formItemOpts.collapseTags"
             :allow-create="formItemOpts.allowCreate"
             :remote="formItemOpts.remote"
             :clearable="formItemOpts.clearable"
             :popper-class="`${formItemOpts.popperClass} model-select-popup-wrap`"
             :reserve-keyword="formItemOpts.reserveKeyword"
             :automatic-dropdown="true"
             :disabled="disabled"
             :autofocus="true"
             default-first-option
             @change="callback('handleChangeForSelected', form, options, $event)"
             @focus="handleFocusForSelect($event)"
             @blur="callback('handleBlur', form, options, $event)"
             :filter-method="filterMethod"
             :remote-method="remoteMethod">
    <el-option v-for="(option,idx) of  optionArr"
               :key="idx+''"
               :label="option[formItemOpts.remoteKey || 'label']"
               :value="option[formItemOpts.remoteVal || 'value']">
    </el-option>
  </el-select>
</template>

<script>
export default {
  data(){
    return {
      activeVal: '',
      timer: ''
    }
  },
  computed: {
    formItemOpts(){
      return this.options.formItemOpts || {};
    },
    optionArr(){
      const {activeVal,remoteData,formItemOpts,options} = this,
        remoteSelect =  remoteData[options.prop],
        resultArr = remoteSelect && (remoteSelect.options || remoteSelect)  || formItemOpts.select || [];
      if(formItemOpts.filterable){
        const valKey = formItemOpts.remoteKey || 'value';
        const arr =  [ ...resultArr ].filter((item) => item[valKey] && item[valKey].includes(activeVal));
        return arr;
      }
      return resultArr;
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
    handleFocusForSelect(event){
      const {callback,form,options} = this;
      // event.target.value
      this.activeVal = '';
      callback('handleFocusForSelect',form,options.select,event)
    },
    filterMethod(val){
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.activeVal = val;
      },300)

    },
    remoteMethod(val) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.callback('handleChangeForSelect', val, this.options);
      },300)
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
